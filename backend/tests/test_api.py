from __future__ import annotations

import asyncio
import unittest

from app.main import home
from app.routes.alerts import get_alerts
from app.routes.analyze import get_analysis
from app.routes.logs import get_logs
from app.routes.summary import get_summary


class ThreatApiTests(unittest.TestCase):
    def test_home_endpoint(self) -> None:
        payload = home()
        self.assertIn("service", payload)

    def test_logs_endpoint(self) -> None:
        payload = get_logs()
        self.assertTrue(payload.logs)

    def test_alerts_endpoint(self) -> None:
        payload = asyncio.run(get_alerts())
        self.assertTrue(payload["alerts"])

    def test_analyze_endpoint(self) -> None:
        payload = asyncio.run(get_analysis())
        self.assertTrue(payload.alerts)
        self.assertGreaterEqual(payload.prediction.risk_score, 0.0)
        self.assertGreater(payload.summary.total_alerts, 0)

    def test_summary_endpoint(self) -> None:
        payload = get_summary()
        self.assertGreater(payload.total_logs, 0)
        self.assertGreaterEqual(payload.total_alerts, 0)


if __name__ == "__main__":
    unittest.main()
