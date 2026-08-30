# ADR-0001: One Next.js estate with separated route groups

Status: Accepted

The corporate website and executive dashboard share brand and deployment ownership, but differ in caching and security. They live in one Next.js application using separate route groups. Server Components are the default. The dashboard is dynamic and non-indexable; the public estate is cacheable and SEO-oriented. Baobab access is limited to typed server-side adapters.
