import requests
from .config import API_URL, API_KEY


def send_log(payload: dict):
    if not API_KEY:
        raise Exception("API key not configured")

    headers = {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"{API_URL}/log",
        json=payload,
        headers=headers
    )

    return response.json()