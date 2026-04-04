import requests
from . import config


def send_log(payload: dict):
    if not config.API_KEY:
        raise Exception("API key not configured")

    headers = {
        "X-API-KEY": config.API_KEY,
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"{config.API_URL}/log/",
        json=payload,
        headers=headers
    )

    return response.json()