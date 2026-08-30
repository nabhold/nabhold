# Architecture overview

This repository is Nabhold Group Africa's independently deployable digital estate. It owns corporate presentation and the executive decision experience; it does not own commerce, ERP, tenancy, identity, intelligence processing, or infrastructure.

- `src/app/(public)` is cacheable, indexable corporate content.
- `src/app/(dashboard)` is dynamic, non-indexable and protected by the server-side session abstraction.
- `src/lib/pulse` is the sole Baobab Pulse HTTP boundary.
- `src/lib/auth` isolates the future Control Plane/federated SSO integration.

No Baobab database may be accessed directly. Preview data is visibly labelled and only validates presentation before the Pulse API contract exists.
