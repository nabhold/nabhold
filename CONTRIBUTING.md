# Contributing

## Repository boundary

This repository owns Nabhold Group Africa's corporate presentation, navigation, content composition, executive decision experience, and frontend-specific behaviour.

It does not own Baobab engines, tenancy, ERP, commerce, intelligence processing, identity, cloud infrastructure, DNS, Kubernetes, or Terraform. Integrate with those capabilities through canonical contracts, APIs, webhooks, or events; never through another product's database.

## Development environment

Use GitHub Codespaces or a compatible Dev Container. The repository consumes the `baobab-dev` v1.2.6 `frontend` profile.

```bash
cp .env.example .env.local
pnpm dev
```

Do not place real credentials in `.env.local` examples, fixtures, tests, screenshots, or issues.

## Quality gates

Before opening a pull request, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Change process

1. Create a focused branch from `main`.
2. Keep each pull request limited to one coherent outcome.
3. Update tests and documentation with behaviour or contract changes.
4. Use conventional commit prefixes such as `feat:`, `fix:`, `docs:`, `test:`, and `chore:`.
5. Complete the pull-request checklist and wait for required checks.

Contract changes must be proposed in `nabhold/shared` first. Infrastructure changes belong in `nabhold/infrastructure`.
