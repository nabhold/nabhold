# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability.

Report security concerns privately to **security@nabhold.com**. Include the affected route or component, reproduction details, likely impact, and any safe supporting evidence. Do not include credentials, personal data, or destructive proof-of-concept material.

Nabhold will acknowledge a complete report, assess severity, coordinate remediation, and disclose publicly only when doing so is safe.

## Supported versions

The default branch and the currently deployed production release receive security fixes. Preview branches and superseded releases are not supported.

## Repository security rules

- Secrets belong in GitHub environments, Codespaces secrets, or the deployment platform—not source control.
- Browsers must never receive Baobab service credentials or call Baobab engine APIs directly.
- Baobab integration must use canonical contracts and server-side adapters.
- `NABHOLD_DASHBOARD_PREVIEW` is development-only and is rejected in production.
- GitHub Actions must be pinned to full commit SHAs.
- Dependencies and container images must be reviewed and updated deliberately.
