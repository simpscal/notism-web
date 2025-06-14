# React Template

A modern, scalable React + TypeScript template powered by Vite. This project provides a robust foundation for building large-scale, maintainable web applications with best practices for architecture, state management, code quality, and developer experience.

---

## Features

- **Vite** for fast development and build
- **TypeScript** for type safety
- **Modular architecture**: app, pages, features, components, core, shared
- **Reusable UI components**
- **Feature-based folder structure**
- **Centralized API client with interceptors and token refresh**
- **State management ready (Redux, React Query, etc.)**
- **Strict ESLint/Prettier configuration**
- **Naming and component conventions**
- **Environment variable support**

---

## Project Structure

```
src/
  app/         # App config, assets, global styles
  pages/       # Top-level pages (route targets)
  features/    # Business logic, feature modules
  components/  # Pure, reusable UI components
  core/        # React-specific shared resources (hooks, contexts, apis)
  shared/      # TypeScript types, constants, utilities
```

See [`docs/architecture.md`](docs/architecture.md) for detailed folder responsibilities and import rules.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- bun or npm

### Installation

```sh
bun install
# or
npm install
```

### Development

```sh
bun run dev
# or
npm run dev
```

### Build

```sh
bun run build
# or
npm run build
```

### Preview

```sh
bun run preview
# or
npm run preview
```

---

## Linting & Formatting

- ESLint and Prettier are pre-configured.
- To lint:

  ```sh
  bun run lint
  # or
  npm run lint
  ```

- To format:

  ```sh
  bun run format
  # or
  npm run format
  ```

---

## Environment Variables

- All environment variables must be prefixed with `VITE_` (see `.env.example`).
- Example:

  ```env
  VITE_API_BASE_URL=https://api.example.com
  VITE_ENVIRONMENT=development
  ```

---

## Conventions & Best Practices

- **Component, model, and naming conventions** are documented in [`docs/`](docs/)
- **Architecture and folder responsibilities**: [`docs/architecture.md`](docs/architecture.md)
- **Component patterns and responsibilities**: [`docs/component.md`](docs/component.md)
- **Naming conventions**: [`docs/naming.md`](docs/naming.md)
- **Model conventions**: [`docs/model.md`](docs/model.md)

---
