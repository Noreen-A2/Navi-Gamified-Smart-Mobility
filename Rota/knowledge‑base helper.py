# --------------------------------------------------------------
# knowledge‑base helper.py
# --------------------------------------------------------------
"""Tiny helper that searches the JSON knowledge‑base.

Public API
-----------
answer_from_kb(message: str) -> Tuple[Optional[str], str]

    * returns a short factual sentence **or** None
    * the second element is ``"kb"`` if the answer came from the KB,
      otherwise ``"llm"`` (meaning the caller should fall back to the language model)
"""

import json
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

# ------------------------------------------------------------------
# Load the JSON (the file name contains a space – keep it exactly!)
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).parent
KB_PATH = BASE_DIR / "Alamein knowledge base .json"

if not KB_PATH.is_file():
    raise FileNotFoundError(
        f"❌ Knowledge‑base not found at {KB_PATH}\n"
        "Make sure the file name is *Alamein knowledge base .json* (space before .json)."
    )

with KB_PATH.open("r", encoding="utf-8") as f:
    KB = json.load(f)


# ------------------------------------------------------------------
# Utility – flatten every collection that holds “entities”
# ------------------------------------------------------------------
def _all_collections() -> List[Tuple[str, List[Dict[str, Any]]]]:
    """Return a list of (collection_name, list_of_items) for every top‑level key that stores objects."""
    # Add new collections here if you extend the KB later
    collections = [
        ("restaurants",   KB.get("restaurants", [])),
        ("cafes",         KB.get("cafes", [])),
        ("pharmacies",    KB.get("pharmacies", [])),
        ("hospitals",    KB.get("hospitals_clinics", [])),
        ("hotels",       KB.get("hotels_resorts", [])),
        ("beaches",      KB.get("beaches", [])),
        ("attractions",  KB.get("attractions_landmarks", [])),
        ("banks",        KB.get("banks_atms", [])),
        ("gas_stations", KB.get("gas_stations", [])),
        ("supermarkets", KB.get("supermarkets", [])),
        ("roads",        KB.get("roads", [])),
        ("districts",    KB.get("districts", [])),   # typo in original – keep as‑is
    ]
    return collections


# ------------------------------------------------------------------
# 1️⃣  Entity lookup – exact / partial (case‑insensitive)
# ------------------------------------------------------------------
def lookup_entity(name: str) -> Optional[Dict[str, Any]]:
    """Return the first object whose “name” (or “name_ar”) contains *name* (case‑insensitive)."""
    name = name.strip().lower()
    for _, items in _all_collections():
        for obj in items:
            if any(
                name in (obj.get(k, "").lower())
                for k in ("name", "name_ar")
                if isinstance(obj.get(k), str)
            ):
                return obj
    return None


# ------------------------------------------------------------------
# 2️⃣  Very small “question → entity” heuristics
# ------------------------------------------------------------------
_KEYWORDS = {
    "where": True, "what": True, "which": True, "how": True,
    "price": True, "cost": True, "open": True, "hours": True,
    "distance": True, "nearest": True, "nearby": True,
    "contact": True, "phone": True, "address": True,
    "facility": True, "amenities": True, "wifi": True,
    "menu": True, "rating": True, "review": True,
    "budget": True, "price_range": True, "entry fee": True,
}


def looks_like_a_kb_question(msg: str) -> bool:
    """
    Cheap heuristic: the sentence mentions Alamein (or a known district)
    **and** contains at least one keyword from ``_KEYWORDS``.
    """
    msg_low = msg.lower()
    if "alamein" not in msg_low:
        # also accept district names that exist in the KB
        for d in ("marina", "university", "downtown", "hotel", "beach",
                  "hospital", "pharmacy", "cafe", "restaurant"):
            if d in msg_low:
                break
        else:
            return False

    return any(kw in msg_low for kw in _KEYWORDS)


# ------------------------------------------------------------------
# 3️⃣  Build a short, factual answer from the raw dict
# ------------------------------------------------------------------
def format_entity_answer(entity: Dict[str, Any]) -> str:
    """Turn a JSON object into a concise, human‑readable sentence."""
    name = entity.get("name") or entity.get("name_ar") or "Unnamed"
    fields = []

    # location
    if "location" in entity:
        loc = entity["location"]
        district = loc.get("district")
        if district:
            fields.append(f"in *{district}*")
        lat = loc.get("lat")
        lng = loc.get("lng")
        if lat is not None and lng is not None:
            fields.append(f"(lat {lat:.4f}, lng {lng:.4f})")

    # opening / hours
    if "open_hours" in entity:
        fields.append(f"open {entity['open_hours']}")
    elif "hours" in entity:
        fields.append(f"hours {entity['hours']}")

    # price / fee
    if "price_range" in entity:
        fields.append(f"price range {entity['price_range']}")
    if "entry_fee_egp" in entity:
        fields.append(f"entry fee {entity['entry_fee_egp']} EGP")

    # rating
    if "rating" in entity:
        fields.append(f"rating {entity['rating']}/5")

    # services / features / facilities (show only a few items)
    for key in ("services", "features", "facilities"):
        if key in entity and isinstance(entity[key], list):
            sample = ", ".join(entity[key][:3])
            fields.append(f"{key}: {sample}")

    # phone
    if "phone" in entity:
        fields.append(f"phone {entity['phone']}")

    return f"{name} – " + "; ".join(fields) + "." if fields else f"{name}."


# ------------------------------------------------------------------
# PUBLIC API – the function the agent will call
# ------------------------------------------------------------------
def answer_from_kb(message: str) -> Tuple[Optional[str], str]:
    """
    Try to answer *message* using the JSON knowledge‑base.

    Returns
    -------
    (answer, source)
        answer : a short sentence or ``None`` if no suitable match.
        source : ``"kb"`` if we found a factual answer,
                 ``"llm"`` if the query is too vague – the caller should
                 fall back to the language model.
    """
    if not looks_like_a_kb_question(message):
        return None, "llm"

    # ------------------------------------------------------------------
    # 1️⃣  Direct entity name match
    # ------------------------------------------------------------------
    tokens = re.split(r"[,\s;:.!?]+", message)
    for token in tokens:
        if not token:
            continue
        ent = lookup_entity(token)
        if ent:
            return format_entity_answer(ent), "kb"

    # ------------------------------------------------------------------
    # 2️⃣  Small keyword‑based fallback – only when we have enough clues
    # ------------------------------------------------------------------
    location_keywords = (
        "marina", "university", "downtown", "hotel",
        "beach", "medical", "coastal"
    )
    qualifier_keywords = (
        "24", "24‑hour", "delivery", "budget", "quiet",
        "wifi", "price", "price‑range", "cheap", "free"
    )

    has_loc = any(k in message.lower() for k in location_keywords)
    has_qual = any(k in message.lower() for k in qualifier_keywords)

    for coll_name, items in _all_collections():
        # e.g. “pharmacy”, “restaurant”, “hotel” appears in the query
        if coll_name.rstrip("s") in message.lower():
            for obj in items:
                if (has_loc and has_qual) or has_loc:
                    return format_entity_answer(obj), "kb"
            # query was too generic → let the LLM handle it
            return None, "llm"

    # ------------------------------------------------------------------
    # Nothing we could turn into a decent answer
    # ------------------------------------------------------------------
    return None, "llm"
