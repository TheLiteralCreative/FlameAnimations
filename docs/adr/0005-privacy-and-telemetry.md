# ADR-0005: No Third-Party Telemetry in MVP

Status: Accepted  
Date: 2026-05-25

## Context
The app is for personal creative use by a minor and should remain private/local.

## Decision
MVP MUST NOT include analytics, tracking, third-party telemetry, ads, or remote logging.

## Consequences
- Privacy is strong by default.
- Operational insight is limited to manual testing and browser console errors.
- Future telemetry, if ever added, MUST be opt-in and documented.

## Alternatives
- Add analytics: rejected as unnecessary and privacy-invasive.
- Local-only debug panel: allowed as a future non-networked diagnostic aid.

## References
SPEC §7, §12.
