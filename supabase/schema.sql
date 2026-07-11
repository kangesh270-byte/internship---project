-- ============================================================================
-- Business Sales Reporting and Analytics Platform
-- Supabase schema
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- Categories ----------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  created_at  timestamptz not null default now()
);

-- ---------- Customers ----------
create table if not exists customers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text,
  phone            text,
  billing_address  text,
  created_at       timestamptz not null default now()
);

-- ---------- Products ----------
create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  category_id     uuid references categories(id) on delete set null,
  price           numeric(12,2) not null default 0,
  cost            numeric(12,2) not null default 0,
  stock_quantity  integer not null default 0,
  reorder_level   integer not null default 5,
  supplier        text,
  created_at      timestamptz not null default now()
);

-- ---------- Employees ----------
create table if not exists employees (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  role          text not null default 'Sales Executive',
  email         text,
  phone         text,
  hire_date     date,
  sales_target  numeric(12,2) not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------- Sales (invoice header) ----------
create table if not exists sales (
  id              uuid primary key default gen_random_uuid(),
  invoice_no      text not null unique,
  customer_id     uuid references customers(id) on delete set null,
  employee_id     uuid references employees(id) on delete set null,
  sale_date       date not null default current_date,
  subtotal        numeric(12,2) not null default 0,
  discount        numeric(12,2) not null default 0,
  tax             numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  payment_status  text not null default 'paid' check (payment_status in ('paid', 'pending', 'overdue')),
  created_at      timestamptz not null default now()
);

-- ---------- Sale line items ----------
create table if not exists sale_items (
  id           uuid primary key default gen_random_uuid(),
  sale_id      uuid not null references sales(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  quantity     integer not null default 1,
  unit_price   numeric(12,2) not null default 0,
  line_total   numeric(12,2) not null default 0
);

create index if not exists idx_sales_date on sales(sale_date);
create index if not exists idx_sales_customer on sales(customer_id);
create index if not exists idx_sales_employee on sales(employee_id);
create index if not exists idx_sale_items_sale on sale_items(sale_id);
create index if not exists idx_sale_items_product on sale_items(product_id);
create index if not exists idx_products_category on products(category_id);

-- ============================================================================
-- Row Level Security
-- Any signed-in user of this app (an internal staff account) can read/write
-- all business data. Public/anonymous access is blocked.
-- ============================================================================

alter table categories  enable row level security;
alter table customers   enable row level security;
alter table products    enable row level security;
alter table employees   enable row level security;
alter table sales       enable row level security;
alter table sale_items  enable row level security;

create policy "Authenticated full access - categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated full access - customers" on customers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated full access - products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated full access - employees" on employees
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated full access - sales" on sales
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated full access - sale_items" on sale_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
