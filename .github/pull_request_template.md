## Purpose

Describe the business or technical outcome of this change.

## Scope

- [ ] The change belongs in the Nabhold corporate digital estate.
- [ ] It does not reproduce Baobab engine, tenancy, ERP, commerce, identity, intelligence, or infrastructure responsibilities.
- [ ] Baobab integration uses an explicit API or canonical contract.

## Verification

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] `pnpm test:e2e` when user journeys changed

## Security and operations

- [ ] No secret or private token is committed.
- [ ] Environment and deployment contract changes are documented.
- [ ] Preview-only behaviour remains impossible in production.
- [ ] Relevant documentation and tests are updated.
