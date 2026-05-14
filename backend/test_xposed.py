import requests

email = "nishant1@gmail.com"
url = f"https://api.xposedornot.com/v1/check-email/{email}"
try:
    response = requests.get(url, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
