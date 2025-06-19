# Project Notes & Knowledge Base

This document contains important concepts, tips, and Q&A for the multi-tenant application project.  
**All answers are written for beginners—no prior knowledge is assumed.**

---

## 🗂️ Next.js Routing & Layouts

### 1. **Basic Routing in Next.js**

- To create a route, make a folder inside `src` with the route name and add a `page.tsx` file inside it.
    - **Default export is required** in `page.tsx`.  
      - ❌ `export const Page = () => { ... }` (named export, does NOT work)
      - ✅ `const Page = () => { ... }; export default Page` (default export, works)

### 2. **Route Grouping**

- You can group routes using parentheses:  
  `src/(home)/test/page.tsx`
    - The `(home)` part is **not included in the URL**.
    - Example:  
      - File: `src/(home)/test/page.tsx`  
      - URL: `localhost:8000/test`  
      - **NOT** `localhost:8000/(home)/test`

### 3. **Layouts in Next.js**

- If you create a `Layout.tsx` file in a folder, it wraps the content of all pages in that folder.
- The `children` prop is automatically populated with the content of the page.
- If you create subdirectories (e.g., `src/(home)/foo/page.tsx`), you **do not** need to create another `layout.tsx` inside `foo` unless you want a different layout.

### 4. **Client vs Server Components**

- By default, everything is a **server component**.
- Adding `"use client"` at the top of a file **opens a portal** for client-side interactivity, but does NOT convert everything to a client component.
- Only the file with `"use client"` and its children can use client-side features (like hooks).
- **Important:**  
  - `"use client"` does NOT mean the component is rendered on the client only; it still uses server-side rendering.

---

## 📝 Categories, Subcategories, and Sidebar Logic

### 1. **Category Dropdown & Sidebar**

- Categories and subcategories are managed in the database (see `collections/Categories.ts`).
- Data is extracted in `layout.tsx` and passed to the `SearchFilter` component.
- Subcategories are displayed on hover using a custom dropdown position function.
- The sidebar uses `useState` for `parentCategory` and `selectedCategory` to manage which categories are shown.
- When a parent category is selected, the sidebar rerenders and shows the correct subcategories.

**React Rerendering Example:**
```js
const [parentCategory, setParentCategory] = useState(null);
const currentCategory = parentCategory ?? data ?? [];
// When setParentCategory is called, the component rerenders and currentCategory is recalculated.
```

---

## 🔗 tRPC Integration

### 1. **What is tRPC?**

- **RPC** stands for "Remote Procedure Call"—a way to call functions on the server from the client.
- With tRPC, you call functions directly (with type safety), instead of making REST API calls.

**Example:**
```js
// REST
const res = await fetch('/api/users/1');
const user = await res.json();

// tRPC
const user = await api.users.getById({ id: 1 });
```

### 2. **How tRPC is Set Up in This Project**

1. **Set up routers:**  
   - Example: `src/modules/categories/server/procedures.ts` defines a `categoriesRouter` with a `getMany` function to fetch data from the DB.

2. **Combine routers:**  
   - All routers are combined in `src/trpc/routers/_app.ts`.

3. **Set up tRPC client and server:**  
   - Client: `src/trpc/client.tsx` (for calling procedures from the client)
   - Server: `src/trpc/server.ts` (for calling procedures from server components)

4. **Usage:**
   - **Server component:**  
     ```js
     const queryClient = getQueryClient();
     void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
     ```
   - **Client component:**  
     ```js
     const trpc = useTRPC();
     const { data } = useQuery(trpc.categories.getMany.queryOptions());
     ```

---

## 🔒 Authentication & Form Handling

### 1. **Form Submission and Validation**

- In `src/modules/auth/ui/views/sign-up-view.tsx`, form submission uses:
  ```js
  form.handleSubmit(onSubmit)
  ```
  - This ensures Zod validation runs before `onSubmit` is called.

- **Real-time validation:**  
  - Use `form.watch('username')` to observe changes.
  - Use `form.formState.errors.username` to check for errors.
  - Set `mode: 'all'` in `useForm` to validate on every change.

**Example:**
```js
const form = useForm<z.infer<typeof registerSchema>>({
  mode: "all",
  resolver: zodResolver(registerSchema),
  defaultValues: { email: '', password: '', username: '' }
});
```

### 2. **How Errors Are Displayed**

- The `<FormMessage />` component automatically displays errors for the current field, using context from the form provider.

---

## 🍪 Cookie Handling & Session Management

### 1. **How Cookies Are Created**

- Cookies are created in a centralized function (e.g., `generateCookies` in `src/modules/auth/utils.ts`).
- The cookie name uses a prefix from the Payload config for multi-tenancy.
- Cookies are set as `httpOnly` for security.

**Example:**
```js
await generateCookies({
  prefix: ctx.db.config.cookiePrefix,
  value: data.token
});
```
- The prefix is set in your Payload config and accessed via `ctx.db.config.cookiePrefix`.

### 2. **Why Use `invalidateQueries` After Sign-In?**

- `invalidateQueries` (from React Query) marks cached data as "stale" for a specific query (like the session).
- This forces React Query to refetch the session, so the UI updates immediately after login.

---

## 🏷️ Dynamic Routing & Params

### 1. **How Dynamic Routing Works**

- In Next.js, dynamic segments in the folder structure (e.g., `[category]`, `[subcategory]`) become keys in the `params` object.
- Example:  
  - File: `src/app/(app)/(home)/[category]/[subcategory]/page.tsx`
  - URL: `/education/test-preparation`
  - `params = { category: "education", subcategory: "test-preparation" }`

### 2. **Why is `params` a Promise?**

- In the App Router, `params` can be a Promise to support async resolution (e.g., for middleware, i18n).
- You must `await params` to get the actual values.

---

## 🛒 Product Collection & Filtering

### 1. **How Product Filtering Works**

- Products are filtered by category and subcategory using a `where` filter.
- Example:
  ```js
  where["category.slug"] = {
    in: [parentCategory.slug, ...subcategoriesSlugs]
  }
  ```
- This finds all products whose category slug is in the list (parent + subcategories).

**If there are no subcategories:**  
- The filter is just `[parentCategory.slug]`, so only products in the parent category are shown.

### 2. **Why Extract Data from Categories First?**

- To show products for both the parent category and all its subcategories, you first fetch the category and its subcategories, then use their slugs to filter products.

### 3. **How Products Are Queried**

- The `where` object is passed to Payload's `find` method to fetch matching products.

---

## 🏷️ Product Filter Hooks

### 1. **How `useProductFilter` Works**

- `useProductFilter` uses `useQueryStates` from `nuqs` to sync filter state with the URL.
- Example:
  ```js
  const [filters, setFilters] = useProductFilter();
  // filters = { minPrice: "10", maxPrice: "100", tags: ["art", "kids"] }
  ```

### 2. **How `onChange` Works**

- `onChange` is a function passed as a prop to child components.
- When called, it updates the filter state in the parent.

**Example:**
```js
const onChange = (key, value) => {
  setFilters({ ...filters, [key]: value });
};
```
- Passing a function as a prop is a core React pattern for parent-child communication.

---

## 💡 Miscellaneous Concepts & Q&A

### 1. **What is `ChangeEvent` in React?**

- `ChangeEvent<HTMLInputElement>` is a TypeScript type for input change events.
- It gives you type safety and autocompletion for event handlers.

### 2. **What is `createLoader` in Product Filter Hooks?**

- `createLoader(params)` creates a server-side loader to extract and parse filters from the URL during SSR.

### 3. **How Does the Double Map Work in Tag/Product Lists?**

- Data from `useInfiniteQuery` is paginated: `data.pages` is an array of pages, each with a `docs` array.
- Double map:
  ```js
  data?.pages.map((page) =>
    page.docs.map((tag) => (
      // render tag
    ))
  )
  ```
- This creates a nested array.  
  **Better:** Use `flatMap` to flatten the array:
  ```js
  data?.pages.flatMap((page) => page.docs).map((tag) => (
    // render tag
  ))
  ```

### 4. **Why Use `[...(value || []), tag]` in Tag Selection?**

- `value` can be `null` or an array.
- `[...(value || []), tag]` ensures you always have an array to add the new tag to, even if `value` is `null`.

**Example:**
- `value = null`, `tag = "art"` → `[..."", "art"]` → `[ "art" ]`
- `value = ["art"]`, `tag = "music"` → `[ "art", "music" ]`

### 5. **What is `getNextPageParam` in Infinite Query?**

- `getNextPageParam` tells React Query how to fetch the next page.
- It receives the last page fetched and returns the parameter for the next page.
- Example:
  ```js
  getNextPageParam: (lastPage) => {
    return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
  }
  ```
- If there are more docs, returns the next page number; otherwise, returns `undefined` to stop fetching.

### 6. **What is `ctx` in tRPC Procedures?**

- `ctx` is the context object passed to every tRPC procedure.
- It contains things like the database instance, user info, etc.

---

## 🛠️ Multi-Tenancy with Payload's Plugin

### 1. **How Does the Multi-Tenant Plugin Work?**

- The plugin adds a `tenant` field to all specified collections.
- Your front-end can query data by tenant, ensuring isolation.
- You must add a `Tenants` collection to control available fields for each tenant.

### 2. **How to Display Tenant Info in Product Cards?**

- The plugin automatically adds the `tenant` field to collections.
- You can access tenant info directly from the product data.

---

## 📝 Additional Notes

- **`setIsOpen((current) => !current)`** is a recommended way to toggle state in React, as it always uses the latest value.
- **Payload CMS** handles image uploads to MongoDB; no need for `multer` or manual upload logic.
- **Admin Panel**: Visit `/admin` to manage all collections and data.

---

## ⚠️ Corrections

- **Incorrect:**  
  `onChange(value.filter((t) => t !== tag || []))`  
  **Correct:**  
  `onChange(value.filter((t) => t !== tag))`  
  The `|| []` is unnecessary and incorrect in this context.

---

## ❓ Unanswered Questions (now answered)

### Q: What is `zinfer` from `src\modules\auth\ui\views\sign-up-view.tsx`?
**A:**  
`z.infer<typeof schema>` is a TypeScript utility from Zod that infers the TypeScript type from a Zod schema.  
**Example:**  
```js
const registerSchema = z.object({ email: z.string(), password: z.string() });
type RegisterInput = z.infer<typeof registerSchema>; // { email: string, password: string }
```

### Q: What is `.mutation` in `src\modules\auth\server\procedures.ts`?
**A:**  
`.mutation` defines a tRPC procedure that is meant to change data (like POST, PUT, DELETE in REST).  
**Example:**  
```js
register: baseProcedure.input(z.object({ ... })).mutation(async ({ input }) => { ... })
```

### Q: How does `req` and `res` (data from frontend) come to the procedures?
**A:**  
In tRPC, the data from the frontend is passed as the `input` argument to the procedure.  
The context (`ctx`) contains things like the database and user session.

### Q: Why is it necessary to put subcategory inside category?
**A:**  
This allows you to easily fetch all subcategories for a given parent category, and display products for both parent and subcategories.

---

## 📚 Useful Concepts

- **React Query**: Handles data fetching, caching, and pagination.
- **Payload CMS**: Powerful headless CMS with built-in admin UI.
- **tRPC**: Type-safe API calls between client and server.
- **nuqs**: Syncs React state with URL query parameters.
- **Role-Based Access**: Planned feature for fine-grained permissions.

---

**If you have more questions, check this chat or ask for clarification!**