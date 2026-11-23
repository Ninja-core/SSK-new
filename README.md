# SSK Professional Coaching Classes

Official website and administrative console for **SSK Professional Coaching Classes** (Class 11th & 12th Chemistry, Ramgarh). Built with Next.js, React 19, Tailwind CSS, and TypeScript.

---

## Quick Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd ssk-coaching-website
npm install
```
*(or using pnpm: `pnpm install`)*

### 2. Environment Setup (Optional)
```bash
cp .env.example .env.local
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## All Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local dev server at `http://localhost:3000` |
| `npm run build` | Build production-ready application |
| `npm run start` | Launch production server after building |
| `npx tsc --noEmit` | Validate TypeScript types across the project |

---

## Admin Portal Access

- **Route**: `/admin` ([http://localhost:3000/admin](http://localhost:3000/admin))
- **Default User ID**: `sskadmin`
- **Default Password**: `SSK@12345`
