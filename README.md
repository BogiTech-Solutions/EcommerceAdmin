# E-Commerce Admin Dashboard

A modern, high-performance Admin Dashboard built with **Next.js 15 (App Router)**, **Tailwind CSS**, **shadcn/ui**, and **Bun**. This dashboard interfaces seamlessly with the E-Commerce Spring Boot REST API for catalog management, order processing, user administration, and payment tracking.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management & Data Fetching:** React Context API & Custom Hooks
- **Type Safety:** [TypeScript](https://www.typescriptlang.org/)

---

## 📂 Project Structure

The project follows a **Feature-Driven & Modular Architecture** to ensure clean separation of concerns and maintainability:

```text
├── app/                  # Next.js App Router (pages, layouts, API routes)
├── components/           # Reusable shared UI components (shadcn/ui base)
├── config/               # App configuration (site settings, nav links, routes)
├── constants/            # Static data, key mappings, and constants
├── context/              # Global state providers (AuthContext, ThemeProvider)
├── features/             # Feature-based domain modules
│   ├── auth/             # Login & authentication UI/logic
│   ├── users/            # User management, role toggling, status tables
│   ├── products/         # Catalog CRUD, image uploads, category selectors
│   ├── orders/           # Order status management & lifecycle tracking
│   └── payments/         # Payment gateways (Stripe / Chapa) verification
├── hooks/                # Custom React hooks (e.g., useAuth, useDataTable)
├── lib/                  # Axios/Fetch API client, utilities (utils.ts)
├── public/               # Static assets (images, favicon)
├── types/                # TypeScript interfaces (matching API DTOs)
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependency manifest
└── tsconfig.json         # TypeScript rules & path aliases (@/*)
```

---

## ✨ Features

- **🔒 Authentication & Security:**
  - Secure JWT authentication flow connected to Spring Boot backend (`/api/v1/auth/login`).
  - Persistent login state via HTTP cookies / local storage using `AuthContext`.
  - Role-Based Access Control (RBAC) ensuring only `ADMIN` users can access management routes.

- **👥 User Management (`/features/users`):**
  - Paginated user list with sorting and filtering.
  - Role updating (`USER` ↔ `ADMIN`).
  - Account status toggle (`enabled` / `disabled`).

- **📦 Catalog & Inventory (`/features/products`):**
  - Category and product CRUD operations.
  - Local file asset preview and upload handlers.

- **💳 Orders & Payments (`/features/orders`, `/features/payments`):**
  - Real-time order status updates.
  - Multi-gateway payment auditing (Stripe Checkout & Chapa integration).

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Bun** installed locally:

```bash
curl -fsSL https://bun.sh/install | bash
```

Also, ensure the **Spring Boot API** backend is running locally at `http://localhost:8080`.

---

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ecommerce-admin-dashboard.git
   cd ecommerce-admin-dashboard
   ```

2. **Install dependencies using Bun:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Run the Development Server:**
   ```bash
   bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to launch the admin panel.

---

## 🧪 Available Scripts

- `bun dev`: Runs the development server on port 3000.
- `bun run build`: Builds the production-ready bundle.
- `bun start`: Starts the production Next.js server.
- `bun run lint`: Runs ESLint for code formatting and quality checks.

---

## 🎨 Adding New shadcn/ui Components

To add additional components from shadcn/ui, run:

```bash
bun x --bun shadcn@latest add <component-name>
```

*Example:*
```bash
bun x --bun shadcn@latest add table dialog dropdown-menu
```

---

## 🤝 REST API Integration Reference

| Module | HTTP Method | API Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate Admin User |
| **Profile** | `GET` | `/api/v1/users/me` | Fetch Current Admin Profile |
| **Users** | `GET` | `/api/v1/users` | List all users (Paginated) |
| **User Role** | `PATCH` | `/api/v1/users/{id}/role` | Update user role |
| **User Status** | `PATCH` | `/api/v1/users/{id}/status` | Toggle user enabled flag |
