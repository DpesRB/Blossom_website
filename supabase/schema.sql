-- ============================================
-- SAMAGOSAIN.COM.NP — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Categories (e.g. "Sarees", "Kurtas", "Wedding Wear")
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),          -- optional sale price
  category_id uuid references categories(id) on delete set null,
  sizes text[] default '{}',              -- e.g. {'S','M','L','XL'}
  colors text[] default '{}',
  stock int default 0,
  is_featured boolean default false,
  is_active boolean default true,         -- soft-hide instead of deleting
  created_at timestamptz default now()
);

-- Product images (a product can have multiple images)
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,       -- main thumbnail
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Customer inquiries / orders (since no payment gateway yet)
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  message text,
  status text default 'new',              -- new | contacted | closed
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security (RLS)
-- Public can READ products/categories/images.
-- Public can INSERT inquiries (submit a form) but not read others' inquiries.
-- Nobody can write to products/categories/images except via the
-- Supabase dashboard (using your service role, which bypasses RLS).
-- ============================================

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table inquiries enable row level security;

create policy "Public can view categories"
  on categories for select
  using (true);

create policy "Public can view active products"
  on products for select
  using (is_active = true);

create policy "Public can view product images"
  on product_images for select
  using (true);

create policy "Public can submit inquiries"
  on inquiries for insert
  with check (true);

-- No select policy on inquiries for public = only you (via dashboard) can read them.

-- ============================================
-- Sample data (optional — delete if you don't want test data)
-- ============================================
insert into categories (name, slug) values
  ('Sarees', 'sarees'),
  ('Kurtas', 'kurtas'),
  ('Wedding Wear', 'wedding-wear');

insert into products (name, slug, description, price, category_id, sizes, colors, stock, is_featured)
select 'Sample Red Saree', 'sample-red-saree', 'A beautiful handwoven red saree.', 4500, id, '{"S","M","L"}', '{"Red","Maroon"}', 10, true
from categories where slug = 'sarees';
