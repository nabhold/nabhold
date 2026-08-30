# Nabhold Group Africa Digital Estate

The corporate frontend for Nabhold Group Africa: an institutional public presence and a protected executive window into Baobab intelligence. It consumes Baobab through APIs; it does not reimplement Baobab.

## Local development

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NABHOLD_DASHBOARD_PREVIEW=true` only for local dashboard UI work.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

See [architecture](docs/architecture.md), [Pulse integration](docs/integrations/pulse.md), and [deployment](docs/deployment.md).
