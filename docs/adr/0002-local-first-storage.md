# ADR-0002: Use Local-First Browser Storage and PNG Export

Status: Accepted  
Date: 2026-05-25

## Context
Artwork should be saved on the device being used without accounts or cloud services.

## Decision
Use PNG export for durable user-controlled files and IndexedDB for an in-browser local gallery.

## Consequences
- Works without backend.
- Gallery is device/browser-specific.
- Browser storage can be evicted, so PNG export remains the backup path.
- Blob storage MUST use IndexedDB rather than localStorage.

## Alternatives
- Server-side storage on iMac: useful later, but more complex.
- Cloud storage: rejected for privacy and simplicity.
- localStorage only: rejected because image data can be too large.

## References
SPEC §3, §7, §9, §14.
