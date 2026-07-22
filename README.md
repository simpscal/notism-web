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
- i18next (en/vi)

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

## 🌐 Internationalization

This project supports multiple languages via **i18next**:

- **Supported locales**: English (`en`), Vietnamese (`vi`)
- **Translation files**: `src/app/i18n/locales/`
- **Language detection**: Reads from `localStorage`, falls back to browser language, then `en`

To add or update translations, edit the JSON files in `src/app/i18n/locales/` and ensure all keys are present in every locale file.

---

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/) and [MSW](https://mswjs.io/) for mocking.

```bash
bun run test          # run all tests
bun run start:mock    # dev server with MSW mocking enabled
```

**Test file placement:** Tests live in a `__tests__/` subdirectory co-located with the module under test.

```
src/app/utils/
  __tests__/
    currency.utils.test.ts   ✅
  currency.utils.ts

src/features/payment/
  __tests__/
    use-payment-signalr.test.ts
```

**Test helper:** `import { renderWithProviders } from '@/test/utils'` — wraps Redux, QueryClient, i18n, and Router for component tests.

---

## 📚 Documents

Project documentation is located in the `docs/` folder:

| File                                   | Purpose                              |
| -------------------------------------- | ------------------------------------ |
| `docs/rules/architecture.md`           | Layer structure and dependency rules |
| `docs/rules/naming.md`                 | Naming conventions for all layers    |
| `docs/rules/components.md`             | Component conventions and examples   |
| `docs/rules/tanstack-query.md`         | useQuery / useMutation patterns      |
| `docs/rules/forms.md`                  | React Hook Form + Zod rules          |
| `docs/rules/i18n.md`                   | Internationalisation rules           |
| `docs/rules/store.md`                  | Redux Toolkit patterns               |
| `docs/integration-flows/oauth-flow.md` | OAuth login sequence diagram         |

---
