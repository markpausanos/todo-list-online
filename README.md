# **Project Setup & Folder Structure**  

## **🛠 Installation Steps**  

### **1️⃣ Install Dependencies**  
```sh
npm install
```

### **2️⃣ Run the Development Server**  
```sh
npm run dev
```

### **3️⃣ Setup Supabase**  
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
│   ├── types/         # TypeScript type definitions
│   ├── actions/       # **Server Actions (e.g., Supabase queries)**
│   ├── hooks/         # Custom hooks
├── .env.local         # Environment variables (ignored by Git)
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies and scripts
```

---

## **🛠 Tech Stack Used**  

### **1️⃣ Next.js (App Router)**  
- React-based framework for full-stack development.  
- Optimized for performance with features like SSR, ISR, and API routes.  

### **2️⃣ Server Actions (Next.js 14+)**  
- **Server-side functions that run without needing API routes**.  
- Used for database interactions and reducing client-server requests.  
- Example: Fetching tasks from Supabase inside an action function instead of a separate API endpoint.  

### **3️⃣ Tailwind CSS**  
- Utility-first CSS framework for rapid UI development.  
- Makes styling components faster and more maintainable.  

### **4️⃣ ShadCN**  
- Customizable component library built on top of Radix UI.  
- Provides accessible and composable UI components that integrate well with Tailwind.  

### **5️⃣ Supabase (PostgreSQL)**  
- Open-source Firebase alternative, providing authentication, database, and storage.  
- Uses PostgreSQL as the database, enabling efficient queries and scalability.  

### **6️⃣ Zustand (State Management)**  
- Simple and lightweight state management library for React.  
- Used for managing global states like UI toggles and task filters.  