from __future__ import annotations

from pathlib import Path

from app.core.config import settings
from app.models.log_model import LogEntry
from app.utils.parser import load_csv_logs, load_json_logs


def read_logs(file_path: Path | None = None) -> list[LogEntry]:
    source = file_path or settings.logs_file
    if source.suffix.lower() == ".csv":
        return load_csv_logs(source)
    return load_json_logs(source)
