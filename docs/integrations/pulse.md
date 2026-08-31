# Baobab Pulse integration

The server adapter expects `BAOBAB_PULSE_API_URL` and `BAOBAB_PULSE_API_TOKEN`, calls `GET /v1/executive-overview`, and validates the response with Zod. Requests use a bounded timeout controlled by `BAOBAB_PULSE_TIMEOUT_MS`, defaulting to 5000 milliseconds.

This route is a frontend dependency, not a claim that Pulse implements it. Its canonical contract must be agreed in `nabhold/shared` and implemented by `nabhold/baobab-pulse`. Browsers must never call Pulse directly, and this repository must never access a Baobab-owned database.
