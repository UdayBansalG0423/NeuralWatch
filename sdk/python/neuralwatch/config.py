API_URL = "http://127.0.0.1:8000"
API_KEY = None


def configure(api_key: str, api_url: str = None):
    global API_KEY, API_URL

    API_KEY = api_key
    if api_url:
        API_URL = api_url