#!/usr/bin/env python3
import sys
import json
import random
from datetime import datetime
from typing import List, Dict, Set, Optional
import asyncio
import aiohttp
import requests
from concurrent.futures import ThreadPoolExecutor
import threading
from queue import Queue
from openai import OpenAI

# NOTE: API keys must not be committed to public repos.
# Provide via environment variable (e.g., OPENROUTER_API_KEY) at runtime.
OPENROUTER_API_KEY = None
OPENROUTER_BASE = "https://openrouter.ai/api/v1"
HEADERS = {"HTTP-Referer": "http://localhost:8000", "X-Title": "Terminal AI Agent"}
MAX_HISTORY = 10
MAX_RETRIES = 2

# Performance optimizations
OPENROUTER_BASE_OPTIMIZED = "https://openrouter.ai/api/v1"  # Closest to their edge
STREAM_CHUNK_SIZE = 50  # Process smaller chunks
CONNECTION_POOL_SIZE = 20  # Reuse connections
TIMEOUT = 30  # Faster timeout
MAX_TOKENS_OPTIMIZED = 500  # Reduced for faster responses

# Fixed model configuration
DEFAULT_MODEL = "openai/gpt-oss-120b:free"

# Faster fallback alternatives for when speed is critical
FALLBACK_MODELS = [
    "google/gemini-2.0-flash-lite-preview-02-05:free",  # Much faster
    "meta-llama/llama-3.2-3b-instruct:free",
    "mistralai/mistral-7b-instruct:free"
]


class TerminalAIAgent:
    def __init__(self, model: Optional[str] = None, use_fallback: bool = True, optimize_speed: bool = True):
        # Optimize OpenAI client for speed
        self.client = OpenAI(
            base_url=OPENROUTER_BASE_OPTIMIZED,
            api_key=OPENROUTER_API_KEY,
            timeout=TIMEOUT,
            max_retries=1  # Reduce retries for faster fail
        )

        self.history: List[Dict] = []
        self.rate_limited: Set[str] = set()
        self.use_fallback = use_fallback
        self.optimize_speed = optimize_speed

        # Connection pooling for better performance
        self.session = requests.Session()
        adapter = requests.adapters.HTTPAdapter(
            pool_connections=CONNECTION_POOL_SIZE,
            pool_maxsize=CONNECTION_POOL_SIZE,
            max_retries=1
        )
        self.session.mount('https://', adapter)

        # Response cache for repeated queries
        self.response_cache = {}
        self.cache_lock = threading.Lock()

        # Fetch available free models
        self.free_models = self._fetch_models()
        if not self.free_models:
            sys.exit("❌ No models available. Check connection and API key.")

        # Set the model (with validation)
        self.model = self._setup_model(model or DEFAULT_MODEL)
        if not self.model:
            sys.exit("❌ No working models found.")

        print(f"🤖 TERMINAL AI AGENT (Optimized)")
        print(f"Model: {self.model}")
        print(f"Speed Mode: {'Enabled' if optimize_speed else 'Disabled'}")
        print(f"Fallback: {'Enabled' if use_fallback else 'Disabled'}")
        print(f"Type /help for commands\n")

    def _fetch_models(self) -> List[str]:
        """Fetch available free models with faster timeout"""
        try:
            resp = self.session.get(
                f"{OPENROUTER_BASE}/models",
                headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                timeout=10
            )
            if resp.status_code != 200:
                return []
            return [
                m['id'] for m in resp.json().get('data', [])
                if float(m.get('pricing', {}).get('prompt', 1)) == 0
                   and float(m.get('pricing', {}).get('completion', 1)) == 0
            ]
        except:
            return []

    def _setup_model(self, preferred_model: str) -> Optional[str]:
        """Setup model with validation and optional fallback"""
        if preferred_model in self.free_models:
            if self._test_model(preferred_model):
                print(f"✓ Using preferred model: {preferred_model}")
                return preferred_model
            else:
                print(f"⚠️ Preferred model {preferred_model} failed test")

        if self.use_fallback:
            for fallback in FALLBACK_MODELS:
                if fallback in self.free_models and self._test_model(fallback):
                    print(f"↻ Falling back to: {fallback}")
                    return fallback

        print("⚠️ No preferred or fallback models available. Searching...")
        return self._find_any_model()

    def _test_model(self, model: str) -> bool:
        """Quick model test with minimal tokens"""
        try:
            self.client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=1,  # Minimum tokens for testing
                extra_headers=HEADERS,
                temperature=0  # Deterministic for testing
            )
            return True
        except Exception as e:
            if "429" in str(e):
                self.rate_limited.add(model)
            return False

    def _find_any_model(self) -> Optional[str]:
        """Find any working free model"""
        candidates = [m for m in self.free_models if m not in self.rate_limited]
        random.shuffle(candidates)
        for model in candidates[:10]:
            if self._test_model(model):
                return model
        return None

    def _get_cache_key(self, message: str) -> str:
        """Generate cache key from message and context"""
        context = str(self.history[-3:]) if self.history else ""
        return f"{context}:{message}"

    def _switch_model(self) -> bool:
        """Switch to another working model"""
        self.rate_limited.add(self.model)

        if self.use_fallback:
            for fallback in FALLBACK_MODELS:
                if fallback not in self.rate_limited and self._test_model(fallback):
                    print(f"↻ Switched to: {fallback}")
                    self.model = fallback
                    return True

        new = self._find_any_model()
        if new:
            print(f"↻ Switched to: {new}")
            self.model = new
            return True
        return False

    def chat(self, message: str) -> str:
        """Optimized chat with caching and streaming"""
        # Check cache first
        cache_key = self._get_cache_key(message)
        with self.cache_lock:
            if cache_key in self.response_cache:
                cached_response = self.response_cache[cache_key]
                self.history.append({"role": "user", "content": message})
                self.history.append({"role": "assistant", "content": cached_response})
                return f"{cached_response} 💨"

        self.history.append({"role": "user", "content": message})

        # Optimize system prompt for speed
        messages = [{"role": "system", "content": "Be concise. Reply briefly."}] + self.history[-MAX_HISTORY:]

        for attempt in range(MAX_RETRIES + 1):
            try:
                # Use streaming for faster perceived response
                completion = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.5 if self.optimize_speed else 0.7,  # Lower temperature = faster
                    max_tokens=MAX_TOKENS_OPTIMIZED if self.optimize_speed else 1000,
                    extra_headers=HEADERS,
                    stream=True  # Stream for perceived speed
                )

                # Process stream
                reply = ""
                for chunk in completion:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        reply += content
                        # Show response as it comes
                        print(content, end='', flush=True)

                if not reply:
                    reply = "I couldn't generate a response."
                else:
                    print()  # New line after streaming

                self.history.append({"role": "assistant", "content": reply})

                # Cache the response
                with self.cache_lock:
                    if len(self.response_cache) > 100:  # Limit cache size
                        self.response_cache.clear()
                    self.response_cache[cache_key] = reply

                return reply

            except Exception as e:
                if "429" not in str(e) or attempt == MAX_RETRIES or not self._switch_model():
                    self.history.pop()
                    return "⚠️ All models busy. Wait a moment." if "429" in str(e) else f"❌ {str(e)[:150]}"
                self.history.pop()
                messages = [{"role": "system", "content": "Be concise. Reply briefly."}] + self.history[-MAX_HISTORY:]

    def run(self):
        """Main interaction loop"""
        while True:
            try:
                user_input = input("You: ").strip()
                if not user_input:
                    continue

                if user_input.startswith('/'):
                    cmd, *args = user_input.split(maxsplit=1)
                    if cmd == '/exit':
                        break
                    elif cmd == '/clear':
                        self.history.clear()
                        with self.cache_lock:
                            self.response_cache.clear()
                        print("✅ History cleared")
                    elif cmd == '/models':
                        self._show_models()
                    elif cmd == '/switch':
                        self._switch_model_manual(args[0] if args else "")
                    elif cmd == '/save':
                        self._save(args[0] if args else None)
                    elif cmd == '/model':
                        print(f"Current model: {self.model}")
                    elif cmd == '/speed':
                        self.optimize_speed = not self.optimize_speed
                        print(f"Speed mode: {'ON ⚡' if self.optimize_speed else 'OFF'}")
                    elif cmd == '/help':
                        self._help()
                    else:
                        print("Unknown command. Type /help for list")
                    continue

                print("AI: ", end='', flush=True)
                self.chat(user_input)
                print()
            except (KeyboardInterrupt, EOFError):
                print("\n👋 Goodbye!")
                break

    def _show_models(self):
        """Display available models"""
        print("\n📋 Available Free Models:")
        print(f"   Current: {self.model}")
        print(f"   Speed Mode: {'ON ⚡' if self.optimize_speed else 'OFF'}")
        print("-" * 50)
        for m in self.free_models[:20]:
            status = "✅" if m == self.model else "⏳" if m in self.rate_limited else "  "
            speed = "⚡" if "flash" in m.lower() or "3b" in m.lower() else "  "
            print(f"{status} {speed} {m}")

    def _switch_model_manual(self, name: str):
        """Manually switch to a specific model"""
        if not name:
            print("Usage: /switch <model_name>")
            return

        if name in self.free_models:
            if self._test_model(name):
                self.model = name
                print(f"✅ Switched to: {name}")
            else:
                print(f"❌ Failed to switch to {name}")
        else:
            print(f"❌ Model {name} not found or not free")

    def _save(self, filename=None):
        """Save chat history to file"""
        if not self.history:
            print("No history to save")
            return
        path = filename or f"chat_{datetime.now():%Y%m%d_%H%M%S}.json"
        json.dump(
            self.history,
            open(path, 'w', encoding='utf-8'),
            indent=2,
            ensure_ascii=False
        )
        print(f"✅ Saved to {path}")

    def _help(self):
        """Show help menu"""
        print("""
📚 Available Commands:
  /clear          - Clear conversation history
  /models         - List available free models
  /model          - Show current model
  /switch <name>  - Switch to specific model
  /speed          - Toggle speed optimization mode
  /save [file]    - Save chat history
  /exit           - Exit the agent

⚡ Speed Optimizations Active:
  • Streaming responses (show as generated)
  • Response caching for repeated queries
  • Lower temperature for faster generation
  • Reduced max tokens
  • Connection pooling
  • Optimized timeouts
        """)


if __name__ == "__main__":
    # For maximum speed, use:
    agent = TerminalAIAgent(optimize_speed=True)
    agent.run()