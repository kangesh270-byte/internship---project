# Vantage — Business Sales Reporting & Analytics Platform

A full web app for the internship project described in the report: customer management,
product/inventory management, sales entry & invoicing, employee performance tracking, an
analytics dashboard, and filterable report generation — built with **React + TypeScript + Vite**
on the front end and **Supabase** (Postgres + Auth) as the backend.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router |
| Charts | Recharts |
| Backend | Supabase (Postgres, Auth, Row Level Security) |
| Auth | Supabase email/password auth |

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project. Note the **Project URL** and **anon public key** (Project Settings → API).
2. Open the SQL Editor in your Supabase dashboard and run, in order:
   - `supabase/schema.sql` — creates all tables, indexes, and Row Level Security policies.
   - `supabase/seed.sql` — loads the sample dataset (30 products, 40 customers, 8 employees, 150 sales, ~395 line items) so the dashboard isn't empty on first run.
3. Under **Authentication → Providers**, email/password sign-up should already be enabled by default. If you want to skip email confirmation while testing, turn off "Confirm email" under Authentication → Settings.
4. Create at least one staff login: either sign up from the app's Login screen, or add a user manually under Authentication → Users.

## 2. Run the app in VS Code

```bash
# 1. Open this folder in VS Code
# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then edit .env and paste your Supabase Project URL + anon key

# 4. Start the dev server
npm run dev
```

The app opens at `http://localhost:5173`. Sign up for an account (or sign in if you already
created one), and you'll land on the dashboard.

## 3. Project structure

```
src/
  lib/supabaseClient.ts    Supabase client (reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
  lib/types.ts              TypeScript types matching the DB schema
  context/AuthContext.tsx   Auth session provider (sign in / sign up / sign out)
  components/               Sidebar, Layout, ProtectedRoute, StatCard
  pages/
    Login.tsx                Sign in / sign up
    Dashboard.tsx             KPIs, revenue trend, payment split, top products, low stock
    Customers.tsx             Customer CRUD (add/edit/delete/search)
    Products.tsx              Product & inventory CRUD, category, stock, reorder alerts
    Sales.tsx                 POS-style sale entry: line items, discount/tax, invoice generation
    Employees.tsx             Employee CRUD + target vs. achieved sales
    Reports.tsx                Daily / Weekly / Monthly / Revenue / Product reports with
                                date, employee, customer filters + CSV export
supabase/
  schema.sql                 Tables + Row Level Security policies
  seed.sql                   Sample dataset as SQL inserts
dataset/
  categories.csv, customers.csv, products.csv, employees.csv, sales.csv, sale_items.csv
```

## 4. Database schema

- **categories** — product categories
- **customers** — name, email, phone, billing address
- **products** — name, category, price, cost, stock_quantity, reorder_level, supplier
- **employees** — name, role, contact info, hire date, monthly sales target
- **sales** — invoice header: customer, employee, date, subtotal/discount/tax/total, payment status
- **sale_items** — invoice line items: product, quantity, unit price, line total

All tables have Row Level Security enabled; only authenticated users of the app can read or
write data (no public/anonymous access).

## 5. The individual dataset

The `dataset/` folder has the same sample data as standalone CSVs (useful for the ML/analytics
side of your other coursework, or to re-import via Supabase's Table Editor → Insert → Import
data from CSV):

- `categories.csv` — 6 rows
- `products.csv` — 30 rows
- `employees.csv` — 8 rows
- `customers.csv` — 40 rows
- `sales.csv` — 150 invoices (Apr 1 – Jul 10, 2026)
- `sale_items.csv` — ~395 line items

`supabase/seed.sql` contains the exact same data as ready-to-run `INSERT` statements, so you
don't have to import the CSVs by hand — just run the SQL file once.

## 6. Notes

- Stock quantity is decremented automatically whenever a sale is recorded from the Sales page.
- Low-stock items (stock ≤ reorder level) surface automatically on the dashboard and in Products.
- Reports can be exported to CSV directly from the Reports page.
- To reset the demo data, re-run `schema.sql` after dropping the tables, then `seed.sql` again.
