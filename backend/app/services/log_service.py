import json

LOG_FILE = "data/logs.json"

def read_logs():
    with open(LOG_FILE, "r") as file:
        return json.load(file)