# Rental Admin Dashboard Assignment

This is a custom admin dashboard built with **Next.js** (Pages Router) to manage user-generated car rental listings. It allows admins to view, approve, reject, and edit listings in a secure and user-friendly interface.

---

## ✨ Features

- Admin authentication using **NextAuth (Credentials provider)**
- Server-side rendering with `getServerSideProps`
- Protected dashboard route
- Listings table with:
  - Pagination
  - Filtering by status (`pending`, `approved`, `rejected`)
  - Search by car name
  - Row-level actions: **Approve**, **Reject**, **Edit**
- Audit table with:
  - Pagination
  - Search my admin name
  - Sort by created date
- Uses **Prisma** with **SQLite**
- UI built with **shadcn/ui** and **Tailwind CSS**

---

## 🛠 Tech Stack

- **Next.js (Pages Router)**
- **NextAuth** for authentication
- **Prisma** ORM with SQLite
- **React Table** via `shadcn/ui`'s `DataTable` component
- **Tailwind CSS** for styling
- **TypeScript**

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone [GITHUB_REPO_URL][https://github.com/ArjunNarzary/rental-dashboard]
cd rental-dashboard
```

### 2. Rename .env.example as .env

### 3. Install dependcies

```bash
npm install
```

### 4. Migrate and generate prisma

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run seed to generate random 20 car rental list

```bash
npx prisma db seed
```

### 6. Run project locally

```bash
npm run dev
```
