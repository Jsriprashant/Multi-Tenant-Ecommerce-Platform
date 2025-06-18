# Multi-Tenant Application

A real multi-tenant e-commerce app where creators have their own storefronts, sell digital products, and get paid through Stripe Connect.  
Features include subdomains for each creator, product reviews, personal libraries for buyers, secure file delivery, and automatic platform fees.  
The platform also provides an admin dashboard with role-based access control.  
Built with **Next.js 15**, **Payload CMS**, and **Stripe**—this project is a practical, modern example of how to build scalable SaaS platforms with all the essentials.

---

## 🚀 Features

- **Multi-Tenancy:** Each customer (tenant) has isolated data and experience.
- **Role-Based Access (Planned):** Easily restrict features and data by user roles (e.g., admin, user, super-admin).
- **API-First:** All data access is via type-safe APIs.
- **Modern UI:** Built with Next.js App Router and React.
- **Extensible:** Add features like Stripe payments, custom roles, and more.

---

## 🏗️ Tech Stack & Key Packages

| Package/Tool                        | Why It's Used / Advantages                                                                                   |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **Next.js**                         | Modern React framework for fast, scalable web apps.                                                         |
| **Payload CMS**                      | Powerful headless CMS for managing all app data, with built-in admin UI and authentication.                 |
| **@payloadcms/plugin-multi-tenant**  | Adds true multi-tenancy to Payload, so each tenant's data is isolated and secure.                           |
| **tRPC**                            | End-to-end type-safe APIs—no need to write API schemas or types twice.                                      |
| **nuqs**                            | Syncs React state with URL query params, making filters/shareable URLs easy.                                |
| **Zod**                             | TypeScript-first schema validation for API inputs and forms.                                                |
| **React Query**                     | Handles data fetching, caching, and pagination for a smooth user experience.                                |

**How this is better than traditional approaches:**  
- No more writing REST endpoints and types separately—tRPC keeps everything in sync.
- Payload CMS gives you a ready-to-use admin panel and authentication out of the box.
- Multi-tenant plugin means you don't have to manually separate tenant data.
- nuqs makes filter/search state shareable via URLs, with almost no code.

---

## 🛠️ Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/multi-tenant-application.git
cd multi-tenant-application
```

### 2. **Install dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Set up environment variables**

Create a `.env` file in the root directory and add your database and secret keys.  
Example:
```
DATABASE_URI=mongodb://localhost:27017/multitenant
PAYLOAD_SECRET=your-secret
```

### 4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📝 Usage

- **Admin Panel:** `/admin` (powered by Payload CMS)
- **Tenants:** Each tenant has its own sub-path and isolated data.
- **Products, Categories, Tags:** Managed via Payload and exposed via tRPC APIs.

---

## 🌱 Future Improvements

- **Stripe Integration:** Add payments and subscriptions per tenant.
- **Role-Based Access:** Fine-grained permissions for users and admins.
- **Custom Domains:** Map each tenant to their own domain.
- **More Integrations:** Email, notifications, analytics, etc.

---

## 📦 Important Packages Explained

### **Payload CMS**
- Headless CMS for all your data (users, products, tenants, etc.).
- Built-in admin UI, authentication, and access control.
- Plugin system for features like multi-tenancy.

### **@payloadcms/plugin-multi-tenant**
- Makes it easy to isolate data per tenant.
- Handles tenant-aware queries and permissions automatically.

### **tRPC**
- Write your API and client calls in one place, with full type safety.
- No need for REST or GraphQL boilerplate.

### **nuqs**
- Keeps filter/search state in sync with the URL.
- Makes sharing and bookmarking filtered views easy.

### **React Query**
- Handles data fetching, caching, and pagination.
- Makes UI fast and responsive, even with lots of data.

---

## 💡 Why This Stack?

- **Rapid development:** Admin UI, APIs, and frontend all work together seamlessly.
- **Type safety:** Fewer bugs, faster refactoring.
- **Scalable:** Add new features or collections with minimal code.
- **Modern best practices:** SSR, SSG, API routes, and more.

---

## 🤝 Contributing

Pull requests and issues are welcome!  
If you have ideas for improvements or want to help, please open an issue or PR.

---

## 📄 License

MIT

---

**Questions?**  
Open an issue or contact the maintainer.
