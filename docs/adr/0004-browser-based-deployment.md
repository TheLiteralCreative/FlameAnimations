# ADR-0004: Host as Browser App on Local iMac

Status: Accepted  
Date: 2026-05-25

## Context
The target host is an always-on late-2015 iMac. Users access the app from iPad and laptop browsers.

## Decision
Build a static browser app and serve it from the iMac over the home LAN using Vite preview, Caddy, nginx, or another simple static server.

## Consequences
- No App Store packaging is required.
- iPad and laptop use the same code path.
- LAN hostname/IP discovery must be documented.
- HTTPS is optional for LAN MVP but may be required for some advanced browser APIs.

## Alternatives
- Native app: rejected due to deployment friction.
- Cloud hosting: not required for MVP.
- Electron desktop app: does not solve iPad access.

## References
SPEC §6, §8, §13.
