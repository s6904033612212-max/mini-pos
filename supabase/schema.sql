-- ขั้นตอน 5.3: วางทั้งไฟล์ใน Supabase → SQL Editor → New query แล้วกด Run (ครั้งเดียว)

-- ตารางสินค้า
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  price numeric not null,
  stock integer not null default 0,
  unit text not null default 'ชิ้น',
  created_at timestamp with time zone default now()
);

-- ตารางการขาย
create table sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  quantity integer not null,
  total_price numeric not null,
  sold_at timestamp with time zone default now()
);

-- เปิดให้อ่าน/เขียนได้แบบเปิดกว้าง (สำหรับ demo เท่านั้น ไม่ควรใช้ในระบบจริง)
alter table products enable row level security;
alter table sales enable row level security;

create policy "public read products" on products for select using (true);
create policy "public write products" on products for insert with check (true);
create policy "public update products" on products for update using (true);
create policy "public delete products" on products for delete using (true);

create policy "public read sales" on sales for select using (true);
create policy "public write sales" on sales for insert with check (true);
