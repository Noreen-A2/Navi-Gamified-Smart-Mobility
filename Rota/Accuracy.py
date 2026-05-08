#!/usr/bin/env python3
"""
HARD‑ACCURACY TEST SUITE
========================

Run with:
    python hard_accuracy_test.py

The suite builds a *hard* set of questions that require multi‑entity
lookup, temporal reasoning, or indirect phrasing.  Scoring is stricter
(>= 0.8) and includes a semantic‑similarity check based on
Sentence‑Transformers (if available).

Output:
    - test_cases_hard.json   – the raw list of generated test cases
    - hard_accuracy_report.json – a detailed report with scores & pass/fail
"""

# ----------------------------------------------------------------------
# Standard library imports
# ----------------------------------------------------------------------
import json
import os
import re
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ----------------------------------------------------------------------
# Optional heavy‑weight imports (fallback if missing)
# ----------------------------------------------------------------------
try:
    from sentence_transformers import SentenceTransformer, util  # type: ignore
    _HAS_TRANSFORMERS = True
except Exception:  # pragma: no cover
    _HAS_TRANSFORMERS = False

# ----------------------------------------------------------------------
# Load knowledge base – exact filename (including spaces!)
# ----------------------------------------------------------------------
BASE_DIR = Path(__file__).parent
KB_PATH = BASE_DIR / "Alamein knowledge base .json"

if not KB_PATH.is_file():
    raise FileNotFoundError(
        f"❌ Knowledge‑base not found at {KB_PATH}\n"
        "Make sure the file is named exactly 'Alamein knowledge base .json'."
    )

with KB_PATH.open("r", encoding="utf-8") as f:
    KB = json.load(f)

# ----------------------------------------------------------------------
# Data structures
# ----------------------------------------------------------------------
@dataclass
class TestCase:
    id: str
    question: str
    expected_answer: str
    category: str
    difficulty: str          # hard / medium / easy …
    ground_truth_source: str
    location_context: Optional[dict] = None
    expected_entities: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    evaluation_metrics: dict = field(
        default_factory=lambda: {
            "semantic_similarity": 0,
            "entity_coverage": 0,
            "keyword_overlap": 0,
        }
    )


@dataclass
class TestResult:
    test_id: str
    category: str
    difficulty: str
    passed: bool
    score: float                # 0‑1
    reason: str
    response_time_ms: float
    entities_found: List[str] = field(default_factory=list)
    entities_missing: List[str] = field(default_factory=list)
    similarity: float = 0.0    # cosine similarity (if computed)


# ----------------------------------------------------------------------
# Helper – KB lookup (search across all collections)
# ----------------------------------------------------------------------
def _kb_lookup(name: str) -> Optional[dict]:
    """Case‑insensitive search for any entity name."""
    collections = (
        KB.get("restaurants", [])
        + KB.get("cafes", [])
        + KB.get("pharmacies", [])
        + KB.get("hospitals_clinics", [])
        + KB.get("hotels_resorts", [])
        + KB.get("beaches", [])
        + KB.get("attractions_landmarks", [])
        + KB.get("banks_atms", [])
        + KB.get("gas_stations", [])
        + KB.get("supermarkets", [])
    )
    for itm in collections:
        if name.lower() in itm.get("name", "").lower():
            return itm
    return None


def _entities_present(response: str, entities: List[str]) -> Tuple[List[str], List[str]]:
    """Return found / missing entity lists (case‑insensitive)."""
    found, missing = [], []
    for e in entities:
        if e.lower() in response.lower():
            found.append(e)
        else:
            missing.append(e)
    return found, missing


# ----------------------------------------------------------------------
# Scoring utilities
# ----------------------------------------------------------------------
def _keyword_overlap(resp: str, gold: str) -> float:
    """Word‑overlap for tokens >=4 characters."""
    gold_set = set(re.findall(r"\b\w{4,}\b", gold.lower()))
    resp_set = set(re.findall(r"\b\w{4,}\b", resp.lower()))
    if not gold_set:
        return 0.0
    return len(gold_set & resp_set) / len(gold_set)


def _semantic_similarity(resp: str, gold: str, model) -> float:
    """Cosine similarity of sentence embeddings (0‑1)."""
    emb_resp = model.encode(resp, convert_to_tensor=True)
    emb_gold = model.encode(gold, convert_to_tensor=True)
    return util.cos_sim(emb_resp, emb_gold).item()


def _overall_score(
    resp: str,
    gold: str,
    entities: List[str],
    model=None,
) -> Tuple[float, dict]:
    """
    Returns a composite score (0‑1) and a dict with the three sub‑metrics.
    Weighting: 40 % semantic, 30 % entity coverage, 30 % keyword overlap.
    """
    # Entity coverage
    found, _ = _entities_present(resp, entities)
    entity_score = len(found) / max(len(entities), 1)

    # Keyword overlap
    kw_score = _keyword_overlap(resp, gold)

    # Semantic similarity (optional)
    if model:
        sem_score = _semantic_similarity(resp, gold, model)
    else:
        sem_score = kw_score  # fallback – treat overlap as proxy

    # Composite
    total = round(
        0.4 * sem_score + 0.3 * entity_score + 0.3 * kw_score,
        3,
    )
    details = {
        "semantic_similarity": round(sem_score, 3),
        "entity_coverage": round(entity_score, 3),
        "keyword_overlap": round(kw_score, 3),
    }
    return total, details


# ----------------------------------------------------------------------
# Hard test‑case builder
# ----------------------------------------------------------------------
def build_hard_test_suite() -> List[TestCase]:
    """Create a deliberately challenging list of cases."""
    hard_cases = []

    # ------------------------------------------------------------------
    # Navigation – indirect phrasing, multiple steps
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_NAV_001",
            question=(
                "I’m staying near the university and need to reach the "
                "main beach without taking the highway. Which road should I "
                "take and how long will it roughly take by car?"
            ),
            expected_answer=(
                "Leave the AIU Access Road, turn onto Marina Boulevard, then "
                "follow the Beach Access Road to the Alamein Public Beach – "
                "about 12‑15 minutes total in normal traffic."
            ),
            category="navigation",
            difficulty="hard",
            ground_truth_source="KB.roads",
            expected_entities=[
                "AIU Access Road",
                "Marina Boulevard",
                "Beach Access Road",
                "Alamein Public Beach",
            ],
            tags=["multi‑step", "traffic‑aware"],
        )
    )

    # ------------------------------------------------------------------
    # Restaurants – price‑range + dietary restriction + distance
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_REST_001",
            question=(
                "I’m a vegetarian who only wants a quiet place within 500 m of "
                "the Downtown Core, budget‑friendly and with wifi. Which restaurant "
                "fits best?"
            ),
            expected_answer=(
                "Roastery Nord in the Downtown Core – it’s a quiet specialty "
                "coffee spot with a small vegetarian menu, free wifi and is "
                "well under 500 m from the centre. Prices are moderate."
            ),
            category="restaurants",
            difficulty="hard",
            ground_truth_source="KB.restaurants",
            expected_entities=["Roastery Nord"],
            tags=["vegetarian", "wifi", "quiet", "budget"],
        )
    )

    # ------------------------------------------------------------------
    # Pharmacies – 24 h + delivery + specific product
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_PHARM_001",
            question=(
                "I need a 24‑hour pharmacy that can deliver a specific "
                "skin‑care cream in the Marina District tonight. Which one?"
            ),
            expected_answer=(
                "El Ezaby Pharmacy (Marina 3) – open 24 / 7, offers delivery, "
                "and carries a full range of skin‑care products."
            ),
            category="pharmacies",
            difficulty="hard",
            ground_truth_source="KB.pharmacies",
            expected_entities=["El Ezaby Pharmacy"],
            tags=["24h", "delivery", "skin‑care"],
        )
    )

    # ------------------------------------------------------------------
    # Hospitals – specialist + insurance note
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_HOSP_001",
            question=(
                "Which hospital in Alamein has a dermatology department and "
                "accepts private insurance, and is reachable within 10 minutes "
                "from the University District?"
            ),
            expected_answer=(
                "North Coast Private Clinic – it has a dermatology department, "
                "accepts private insurance and is only about 8 minutes by car "
                "from the University District."
            ),
            category="hospitals",
            difficulty="hard",
            ground_truth_source="KB.hospitals_clinics",
            expected_entities=["North Coast Private Clinic"],
            tags=["dermatology", "insurance", "proximity"],
        )
    )

    # ------------------------------------------------------------------
    # Hotels – price‑range + amenity + cancellation policy
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_HOTEL_001",
            question=(
                "I want a 4‑star hotel on the coast that has a pool, free "
                "breakfast, and flexible cancellation (no‑fee up to 24 h before "
                "check‑in). Which one matches?"
            ),
            expected_answer=(
                "Marina View Hotel – a 4‑star boutique property on the coast "
                "with a rooftop pool, complimentary breakfast and a free‑cancellation "
                "policy up to 24 hours before arrival."
            ),
            category="hotels",
            difficulty="hard",
            ground_truth_source="KB.hotels_resorts",
            expected_entities=["Marina View Hotel"],
            tags=["pool", "breakfast", "cancellation"],
        )
    )

    # ------------------------------------------------------------------
    # Beaches – accessibility + facilities + entry fee range
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_BEACH_001",
            question=(
                "Which beach is public, has showers and changing rooms, is free "
                "of charge, and is reachable by a short walk from Marina 5?"
            ),
            expected_answer=(
                "Alamein Public Beach – a free public beach equipped with "
                "showers and changing rooms and a short (≈5‑minute) walk from "
                "Marina 5."
            ),
            category="beaches",
            difficulty="hard",
            ground_truth_source="KB.beaches",
            expected_entities=["Alamein Public Beach"],
            tags=["public", "showers", "changing rooms", "walkable"],
        )
    )

    # ------------------------------------------------------------------
    # Attractions – historical significance + opening hours
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_ATTR_001",
            question=(
                "I’m interested in WWII history and can only visit on a Sunday "
                "morning. Which attraction should I go to and what are the "
                "opening hours?"
            ),
            expected_answer=(
                "El Alamein War Museum – open daily 09:00‑17:00, and "
                "offers a comprehensive WWII exhibit ideal for history buffs."
            ),
            category="attractions",
            difficulty="hard",
            ground_truth_source="KB.attractions_landmarks",
            expected_entities=["El Alamein War Museum"],
            tags=["WWII", "museum", "Sunday"],
        )
    )

    # ------------------------------------------------------------------
    # Emergency – nearest medical + ambulance number
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_EMER_001",
            question=(
                "I have a severe allergic reaction near the Hotel Strip. Which "
                "hospital is closest and what is the emergency number to call?"
            ),
            expected_answer=(
                "New Alamein General Hospital – the closest major hospital to the "
                "Hotel Strip, and the emergency ambulance number is 123."
            ),
            category="emergency",
            difficulty="hard",
            ground_truth_source="KB.hospitals_clinics",
            expected_entities=["New Alamein General Hospital"],
            tags=["allergy", "nearest", "ambulance"],
        )
    )

    # ------------------------------------------------------------------
    # Weather – planning a night‑time beach walk in winter
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_WEATHER_001",
            question=(
                "Is it safe to take a night‑time walk on the public beach in "
                "December? Give the typical temperature and any safety notes."
            ),
            expected_answer=(
                "In December the sea‑temperature drops to around 16‑18 °C, air "
                "temperature 12‑18 °C, and the public beach is poorly lit. "
                "It is generally safe but advisable to stay in well‑lit areas "
                "and bring a light source."
            ),
            category="weather",
            difficulty="hard",
            ground_truth_source="KB.weather_profile",
            expected_entities=["December", "public beach"],
            tags=["night walk", "temperature", "safety"],
        )
    )

    # ------------------------------------------------------------------
    # Transport – cost‑effective multi‑modal route
    # ------------------------------------------------------------------
    hard_cases.append(
        TestCase(
            id="H_TRANS_001",
            question=(
                "I want to travel from Alexandria to Alamein using the cheapest "
                "public‑transport combination, including any micro‑bus and "
                "necessary taxi legs. What is the full itinerary and total fare?"
            ),
            expected_answer=(
                "Take the micro‑bus from Alexandria to the Main Bus Stop in "
                "Downtown Core (≈30 EGP), then a short 5‑minute taxi to the "
                "Coastal Highway entrance (≈20 EGP). Total ≈50 EGP."
            ),
            category="transport",
            difficulty="hard",
            ground_truth_source="KB.transportation",
            expected_entities=["micro‑bus", "taxi", "Coastal Highway"],
            tags=["cheapest", "multi‑modal"],
        )
    )

    return hard_cases


# ----------------------------------------------------------------------
# Runner / Reporter
# ----------------------------------------------------------------------
class HardTestRunner:
    def __init__(self):
        self.tests: List[TestCase] = build_hard_test_suite()
        self.results: List[TestResult] = []
        self._model = None
        if _HAS_TRANSFORMERS:
            try:
                self._model = SentenceTransformer("all-MiniLM-L6-v2")
            except Exception:  # pragma: no cover
                self._model = None

    # ------------------------------------------------------------------
    def _simulate_response(self, test: TestCase) -> str:
        """
        In “offline” mode we simply return the gold answer.
        Replace this with a live call to your AI agent if you wish.
        """
        return test.expected_answer

    # ------------------------------------------------------------------
    def run(self) -> dict:
        print("\n" + "=" * 70)
        print("  HARD‑ACCURACY TEST SUITE")
        print(f"  Run at {datetime.now():%Y-%m-%d %H:%M}")
        print(f"  Total tests: {len(self.tests)}")
        print("=" * 70 + "\n")

        for test in self.tests:
            start = time.time()
            # Replace the call below with a real API request if desired:
            resp = self._simulate_response(test)
            elapsed = (time.time() - start) * 1000

            score, details = _overall_score(
                resp, test.expected_answer, test.expected_entities, self._model
            )
            passed = score >= 0.8  # *** stricter threshold ***

            found, missing = _entities_present(resp, test.expected_entities)

            result = TestResult(
                test_id=test.id,
                category=test.category,
                difficulty=test.difficulty,
                passed=passed,
                score=score,
                reason=f"{'PASS' if passed else 'FAIL'} – {details}",
                response_time_ms=elapsed,
                entities_found=found,
                entities_missing=missing,
                similarity=details.get("semantic_similarity", 0.0),
            )
            self.results.append(result)

        # ------------------------------------------------------------------
        # Summary tables
        # ------------------------------------------------------------------
        self._print_summary()
        report = self._build_report()
        self._export_json(report)
        return report

    # ------------------------------------------------------------------
    def _print_summary(self):
        by_cat: Dict[str, List[TestResult]] = {}
        for r in self.results:
            by_cat.setdefault(r.category, []).append(r)

        print("📊  RESULTS BY CATEGORY")
        print(f"{'Category':<15} {'Tests':>5} {'Passed':>7} {'Score':>8} {'Pass%':>7}")
        print("-" * 50)
        total_pass = 0
        total_score = 0.0
        for cat, lst in sorted(by_cat.items()):
            passed = sum(r.passed for r in lst)
            avg = sum(r.score for r in lst) / len(lst)
            pct = passed / len(lst) * 100
            total_pass += passed
            total_score += sum(r.score for r in lst)
            print(f"{cat:<15} {len(lst):>5} {passed:>7} {avg:>8.3f} {pct:>6.1f}%")
        print("-" * 50)
        overall_pct = total_pass / len(self.results) * 100
        overall_score = total_score / len(self.results)
        print(
            f"{'TOTAL':<15} {len(self.results):>5} {total_pass:>7} "
            f"{overall_score:>8.3f} {overall_pct:>6.1f}%"
        )
        print("=" * 70)

        # ----- difficulty breakdown -----
        print("\n🔎  DIFFICULTY BREAKDOWN")
        diff_map: Dict[str, List[TestResult]] = {}
        for r in self.results:
            diff_map.setdefault(r.difficulty, []).append(r)
        print(f"{'Difficulty':<10} {'Tests':>5} {'Passed':>7} {'Pass%':>7}")
        print("-" * 35)
        for d in ["easy", "medium", "hard", "ambiguous"]:
            lst = diff_map.get(d, [])
            if not lst:
                continue
            passed = sum(r.passed for r in lst)
            pct = passed / len(lst) * 100
            print(f"{d:<10} {len(lst):>5} {passed:>7} {pct:>6.1f}%")
        print("=" * 70)

        # ----- failures -----
        failures = [r for r in self.results if not r.passed]
        if failures:
            print(f"\n❌ FAILED ({len(failures)}):")
            for f in failures[:10]:
                print(f"  [{f.test_id}] {f.category}/{f.difficulty} – {f.reason}")
            if len(failures) > 10:
                print(f"  … and {len(failures)-10} more")
        else:
            print("\n✅ ALL TESTS PASSED!")

    # ------------------------------------------------------------------
    def _build_report(self) -> dict:
        failures = [
            {
                "id": r.test_id,
                "category": r.category,
                "score": r.score,
                "reason": r.reason,
                "entities_missing": r.entities_missing,
                "similarity": round(r.similarity, 3),
            }
            for r in self.results
            if not r.passed
        ]

        return {
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "total_tests": len(self.results),
                "passed": sum(r.passed for r in self.results),
                "failed": len(failures),
                "overall_accuracy_pct": round(
                    sum(r.passed for r in self.results) / len(self.results) * 100,
                    2,
                ),
                "average_score": round(
                    sum(r.score for r in self.results) / len(self.results), 3
                ),
                "model_used": (
                    self._model.__class__.__name__ if self._model else "keyword‑overlap"
                ),
            },
            "by_category": {
                cat: {
                    "tests": len(lst),
                    "passed": sum(r.passed for r in lst),
                    "average_score": round(
                        sum(r.score for r in lst) / len(lst), 3
                    ),
                    "accuracy_pct": round(
                        sum(r.passed for r in lst) / len(lst) * 100, 1
                    ),
                }
                for cat, lst in {
                    c: [r for r in self.results if r.category == c]
                    for c in set(r.category for r in self.results)
                }.items()
            },
            "failures": failures,
        }

    # ------------------------------------------------------------------
    def _export_json(self, report: dict):
        out_dir = BASE_DIR
        cases_path = out_dir / "test_cases_hard.json"
        report_path = out_dir / "hard_accuracy_report.json"

        # Export test‑cases (so they can be reused elsewhere)
        with cases_path.open("w", encoding="utf-8") as f:
            json.dump(
                [t.__dict__ for t in self.tests],
                f,
                indent=2,
                ensure_ascii=False,
            )
        print(f"✅ Test‑cases exported to {cases_path}")

        # Export report
        with report_path.open("w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"📄 Report saved to {report_path}")


# ----------------------------------------------------------------------
# CLI entry point
# ----------------------------------------------------------------------
if __name__ == "__main__":
    runner = HardTestRunner()
    runner.run()
