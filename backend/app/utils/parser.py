from __future__ import annotations

import csv
import json
from pathlib import Path

from app.models.log_model import LogEntry


def load_json_logs(file_path: Path) -> list[LogEntry]:
    with file_path.open("r", encoding="utf-8") as file:
        payload = json.load(file)
    return [LogEntry(**item) for item in payload]


def load_csv_logs(file_path: Path) -> list[LogEntry]:
    with file_path.open("r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        return [LogEntry(**row) for row in reader]
