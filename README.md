# **Project Setup & Folder Structure**

## **🛠 Installation Steps**

## **1️⃣ Install Dependencies**

```sh
npm install
```

## **2️⃣ Run the Development Server**

```sh
npm run dev
```

## **3️⃣ Setup Supabase (if used)**

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

---

## **📂 Code Folder Structure (Next.js + Supabase)**

```
/my-project
├── public/            # Static assets (images, favicon, etc.)
├── src/               # Main source folder
│   ├── app/           # App Router (Next.js 13+)
│   │   ├── layout.tsx # Global layout
│   │   ├── page.tsx   # Main page
│   │   ├── (todos)/   # Nested routes (e.g., /tasks)
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions (e.g., API helpers)
│   ├── stores/        # Zustand or Context for state management
│   ├── styles/        # Global styles (if using CSS/SCSS)
│   ├── types/         # TypeScript type definitions
│   ├── actions/       # Server actions (e.g., Supabase queries)
│   ├── hooks/         # Custom hooks
├── .env.local         # Environment variables (ignored by Git)
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies and scripts
```
