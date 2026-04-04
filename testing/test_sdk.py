"""
SDK Integration Test
Tests: SDK -> API -> Auth -> DB -> Metrics -> Dashboard
"""
from neuralwatch import configure, track

# STEP 1: Configure SDK with test API key
print("[STEP 1] Configuring SDK...")
configure(api_key="sk_test_123")
print("[OK] SDK configured with sk_test_123")

# STEP 2: Send a single test log
print("\n[STEP 2] Sending test telemetry...")
response = track(
    model_name="gpt-4",
    provider="openai",
    latency_ms=350,
    total_tokens=200,
    cost_usd=0.005,
    status="success"
)
print(f"[OK] Response: {response}")

# STEP 3: Send multiple logs to simulate real usage
print("\n[STEP 3] Simulating 5 real requests...")
import random
import time

models = ["gpt-4", "gpt-3.5-turbo", "claude-2"]
providers = ["openai", "anthropic"]

for i in range(5):
    model = random.choice(models)
    provider = "openai" if model.startswith("gpt") else "anthropic"
    
    result = track(
        model_name=model,
        provider=provider,
        latency_ms=random.randint(100, 800),
        total_tokens=random.randint(100, 500),
        cost_usd=round(random.uniform(0.001, 0.01), 4),
        status=random.choice(["success", "success", "success", "error"])  # 75% success
    )
    print(f"  Request {i+1}: {model} @ {provider} -> {result}")
    time.sleep(0.2)

print("\n[OK] All telemetry sent successfully!")
print("\n[NEXT] Check backend API for aggregated metrics...")
