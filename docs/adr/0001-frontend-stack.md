# ADR-0001: Use Vite, React, TypeScript, and HTML Canvas

Status: Accepted  
Date: 2026-05-25

## Context
The app needs to be simple, fast, browser-based, and easy to modify later in VS Code/Claude Code.

## Decision
Use Vite + React + TypeScript for the app shell and state management, with HTML Canvas for drawing.

## Consequences
- Fast local development.
- Small enough for a learning-friendly codebase.
- Canvas gives direct drawing performance.
- React state MUST not re-render on every pointer movement; drawing logic SHOULD use refs and canvas context.

## Alternatives
- Plain HTML/JS: simpler tooling, but less structured for future growth.
- Next.js: unnecessary server/runtime complexity for MVP.
- Native iPad app: higher deployment friction.

## References
SPEC §5, §8, §11.
