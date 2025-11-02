# Notism

A modern web application built with React, TypeScript, and Vite. Notism provides a robust platform for [brief description of what Notism does - please update this with actual project purpose].

## 🚀 Features

- ⚡ **Blazing Fast** - Built with Vite for optimal performance
- 🎨 **Beautiful UI** - Styled with Tailwind CSS and Radix UI primitives
- 🔄 **State Management** - Powered by Redux Toolkit and React Query
- 📱 **Responsive** - Works on all device sizes
- 🛠 **Developer Experience**
  - TypeScript for type safety
  - ESLint + Prettier for code quality
  - Husky for git hooks
  - Commit linting
- 🎛 **Modern Stack**
  - React 19
  - React Router v7
  - Tailwind CSS v4
  - Radix UI components
  - Date-fns for date handling
  - Zod for schema validation

---

## 🏗 Project Structure

```
src/
  app/         # App configuration and global styles
  components/  # Reusable UI components
  core/        # Core functionality (APIs, contexts, guards)
  features/    # Feature-based modules
  public/      # Static assets
```

Detailed documentation is available in the `docs/` directory.

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

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
bun run build

# Preview the production build
bun run preview
```

### Docker Support

Build and run using Docker:

```bash
docker-compose up --build
```

---

## 🛠 Development

### Linting & Formatting

```bash
# Run ESLint
bun run lint

# Format code with Prettier
bun run format
```

### Git Hooks

This project uses Husky for Git hooks. Pre-commit hooks will automatically run linting and formatting.

### Icons

To generate TypeScript types for SVG icons:

```bash
bun run icons:generate
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_BASE_URL=your_api_url_here
# Add other environment variables here
```

See `.env.example` for reference.

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
