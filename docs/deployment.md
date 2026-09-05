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
| `PAYLOAD_BASE_URL` | Server | Headless Payload (`nabhold/baobab-cms`) origin. Absent means "content unavailable," not an error. |
| `PAYLOAD_API_TOKEN` | Server secret | Payload REST credential. Never exposed via `NEXT_PUBLIC_*`. |
| `PAYLOAD_REVALIDATE_SECRET` | Server secret | Bearer token required by `POST /api/revalidate`. Endpoint returns 503 while unset. |
| `PAYLOAD_TIMEOUT_MS` | Server | Positive request timeout in milliseconds; defaults to 5000 |
| `NABHOLD_CONTENT_DEV_FALLBACK` | Server | Local, non-authoritative portfolio fallback only; rejected when `NODE_ENV=production` |

Production deployment must set `NABHOLD_DASHBOARD_PREVIEW=false` and `NABHOLD_CONTENT_DEV_FALLBACK=false`. A true value for either fails closed rather than creating synthetic executive sessions or fabricated portfolio content — see `src/lib/auth/session.ts` and `src/integrations/payload/config.ts#isDevContentFallbackEnabled`.
