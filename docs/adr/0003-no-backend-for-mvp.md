# ADR-0003: Do Not Build a Backend for MVP

Status: Accepted  
Date: 2026-05-25

## Context
The MVP needs to be available ASAP and used by one primary artist on trusted home devices.

## Decision
Ship MVP as a static single-page app with no backend API, no database server, and no authentication.

## Consequences
- Deployment is simpler on the iMac.
- No OpenAPI contract is needed for MVP.
- Shared galleries and cross-device sync are deferred.
- If the app is exposed outside the LAN, this decision MUST be revisited.

## Alternatives
- Node/Express API: unnecessary for single-user MVP.
- Postgres/SQLite gallery: useful only if shared server-side storage is required.
- Firebase/Supabase: rejected for cloud dependency.

## References
SPEC §5, §7, §9, §13.
