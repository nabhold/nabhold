# Deployment contract

The Node.js 22 Next.js service listens on port 3000 and exposes `GET /api/health`. Infrastructure belongs to `nabhold/infrastructure`.

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL |
| `BAOBAB_PULSE_API_URL` | Server | Pulse API origin |
| `BAOBAB_PULSE_API_TOKEN` | Server secret | Pulse credential |
| `BAOBAB_PULSE_TIMEOUT_MS` | Server | Positive request timeout in milliseconds; defaults to 5000 |
| `BAOBAB_CONTROL_PLANE_API_URL` | Server | Future identity API |
| `NABHOLD_DASHBOARD_PREVIEW` | Server | Local preview only; rejected when `NODE_ENV=production` |

Production deployment must set `NABHOLD_DASHBOARD_PREVIEW=false`. A true value causes preview authentication to fail closed rather than create a synthetic executive session.
