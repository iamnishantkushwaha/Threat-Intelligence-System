# Project Report

The backend now follows a modular threat-intelligence layout with separate routers, services, models, utilities, configuration, tests, and ML scaffolding.

Current detections include:
- brute-force login attempts
- unusual login hours
- unknown IP access

The AI layer is intentionally lightweight and uses extracted features plus local model artifacts so the project remains easy to run in a classroom or prototype setting.
