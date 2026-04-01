# Notism

A modern web application built with React, TypeScript, and Vite. Notism provides a robust platform for [brief description of what Notism does - please update this with actual project purpose].

## 📖 Table of Contents

- [Technologies](#-technologies)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [Mocking Data](#-mocking-data)
- [Documents](#-documents)

---

## 🛠 Technologies

- React 19
- React Router v7
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI
- Redux Toolkit
- TanStack Query
- Zod
- Date-fns

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or later
- bun (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
# or
npm install
```

### Development

Start the development server:

```bash
bun run dev
# or
npm run dev
```

### Building for Production

```bash
# Build the application
bun run build:prod

# Preview the production build
bun run preview
```

### Docker Support

Build and run using Docker:

```bash
docker-compose up --build
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_BASE_URL=your_api_url_here
VITE_ENABLE_MOCK=true  # Enable Mock Service Worker for development
# Add other environment variables here
```

---

## 🎭 Mocking Data

This project uses [Mock Service Worker (MSW)](https://mswjs.io/) to mock API endpoints during development.

**Enable mocking** by setting `VITE_ENABLE_MOCK=true` in your `.env` file. The mock server intercepts API requests and returns responses from `mocks/data/foods.json`.

**Customization:** Edit `mocks/data/foods.json` for data and `mocks/handlers.ts` for request handling. See `mocks/README.md` for details.

---

## 📚 Documents

Project documentation is located in the `docs/` folder:

| Folder               | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `rules/`             | Architecture, naming, and coding conventions        |
| `integration-flows/` | Integration flow diagrams and sequence descriptions |

---
