# Deployment contract

The Node.js 22 Next.js service listens on port 3000 and exposes `GET /api/health`. Infrastructure belongs to `nabhold/infrastructure`.

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL |
| `BAOBAB_PULSE_API_URL` | Server | Pulse origin |
| `BAOBAB_PULSE_API_TOKEN` | Server secret | Pulse credential |
| `BAOBAB_CONTROL_PLANE_API_URL` | Server | Future identity API |
| `NABHOLD_DASHBOARD_PREVIEW` | Server | Local preview only; never production |
