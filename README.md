# Nabhold Group Africa Digital Estate

The corporate frontend for Nabhold Group Africa: an institutional public presence and a protected executive window into Baobab intelligence. It consumes Baobab through APIs; it does not reimplement Baobab.

## GitHub Codespaces

Choose **Code → Codespaces → Create codespace on main**. The repository uses the pinned `baobab-dev` v1.2.6 `frontend` profile, installs the locked pnpm dependencies, and forwards the Next.js development server privately on port 3000.

After the Codespace is ready:

```bash
cp .env.example .env.local
pnpm dev
```

## Local development

Use a Dev Container-compatible editor for parity with Codespaces. For a direct Node.js 22 installation:

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Set `NABHOLD_DASHBOARD_PREVIEW=true` only for local dashboard UI work. The application rejects preview sessions when `NODE_ENV=production`.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

GitHub CI runs the same gates using the `baobab-dev:1.2.6-frontend-e2e` profile.

See [architecture](docs/architecture.md), [Pulse integration](docs/integrations/pulse.md), [Payload CMS integration](docs/integrations/payload.md), [content model](docs/content-model.md), and [deployment](docs/deployment.md).

## Foundation 4

Codespaces uses `ghcr.io/nabhold/baobab-dev:1.2.6-frontend`. The SHA-pinned
Foundation gate validates contract compatibility and reproducibility and scans
source, dependencies, secrets, configuration, and the deployable image.
Fixable transitive dependencies are constrained through reviewed pnpm overrides
and remain visible in the committed lockfile.
