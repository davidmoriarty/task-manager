# Task Manager

A full-stack task management application built with Bun, Hono, React, and shared TypeScript types.

This project focuses on end-to-end application architecture using the BHVR stack, emphasizing shared types, clean API boundaries, authentication flows, and pragmatic UI state management.

## Why this project

This project exists to demonstrate:

- End-to-end type safety between client and server
- Clean API design with predictable request/response flows
- Practical authentication patterns
- Shared domain models across frontend and backend
- A modern full-stack setup without framework lock-in

To support this goal, the application is intentionally implemented with specific architectural constraints.

## Stateless Demo Mode

This project is intentionally implemented as a **stateless demo API**.

- User accounts and tasks are stored **in memory** on the server.
- All data resets on server restart or redeploy.
- JWTs are used for authentication with expiration, issuer, and audience validation.
- The goal is to demonstrate **API design, shared types, and auth flows**, not persistence.

A database-backed version of this architecture is intentionally deferred and explored separately.

## Tech Stack

- **Runtime:** Bun
- **Backend:** Hono
- **Frontend:** React + Vite
- **Type Sharing:** Shared workspace package
- **Monorepo Tooling:** Turbo

This app follows the BHVR stack approach, providing a lightweight full-stack monorepo with shared types and flexible deployment options.

## Features

- User authentication flow suitable for local development and demos
- Task creation, completion, and deletion
- Client-side state synchronized with backend APIs using explicit request/response flows
- Shared task and user types across frontend and backend
- Clear separation of API, UI, and shared domain logic

## Screenshots

![Task Manager – Task List View](./docs/screenshots/taskmanager-tasklist.png)
![Task Manager – Login View](./docs/screenshots/taskmanager-login.png)

## Status

Core functionality is complete and stable.

Planned follow-ups include:
- Database-backed persistence
- Production-grade authentication
- Expanded production hardening

## Deployment Notes

The backend API is deployed for demonstration purposes.

- The deployed API is **stateless** and may reset at any time.
- It is not intended for persistent user data or production workloads.
- Health and availability are monitored, but durability is not guaranteed.

## Limitations & Design Notes

This project is intentionally scoped for architectural clarity rather than production completeness:

- **Authentication**
  - Uses a simplified token-based flow suitable for demos and local development.
  - Tokens are stored client-side and are not persisted across server restarts.
  - JWTs are short-lived and expire automatically after a set period.
  - Passwords are hashed using bcrypt.
  - No OAuth or refresh-token rotation is implemented in this version.

- **Persistence**
  - Tasks are stored in memory on the server.
  - Data resets on server restart; no database is currently configured.
  - Persistence is a planned follow-up to demonstrate database integration.

- **Deployment**
  - The app is structured for flexible deployment, but is currently intended to run locally.
  - Client and server can be deployed independently once persistence is added.

These constraints are deliberate to keep the focus on **type sharing, API boundaries, and full-stack structure** rather than infrastructure complexity.

## What I’d Do Differently in Production

If this application were being prepared for production use, I would make the following changes:

- **Authentication**
  - Replace the demo token flow with secure, hashed credentials and refresh-token rotation.
  - Store auth tokens in HttpOnly cookies instead of localStorage.
  - Add proper error handling, rate limiting, and account lockout protections.

- **Persistence**
  - Introduce a relational database (e.g. PostgreSQL or SQLite) for task and user data.
  - Add migrations and explicit data access layers.
  - Persist user sessions and task state across restarts.

- **API & Security**
  - Validate all request payloads using a schema validation layer.
  - Harden headers and CORS configuration for production environments.
  - Add structured logging and error monitoring.

- **Frontend**
  - Improve loading and error states for slower or unreliable networks.
  - Add optimistic updates with rollback for a smoother UX.
  - Improve accessibility auditing and keyboard flows across all views.

- **Deployment**
  - Deploy the API and client independently.
  - Add environment-specific configuration and secrets management.
  - Configure CI for linting, type-checking, and builds.

These changes are intentionally deferred in this version to keep the project focused on **full-stack structure, type sharing, and API clarity** rather than infrastructure complexity.

## Project Structure

- ├── client/   # React frontend
- ├── server/   # Hono API
- ├── shared/   # Shared TypeScript types

## Getting Started

```bash
bun install
bun run dev
```

## Related Links

- Portfolio: https://davidmoriarty.dev/projects/task-manager
- GitHub: https://github.com/davidmoriarty/task-manager
