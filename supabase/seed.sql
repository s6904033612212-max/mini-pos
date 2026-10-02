-- ขั้นตอน 5.4: ข้อมูลสินค้าตั้งต้น 10 SKU (ตรงกับที่อยู่ในฐานข้อมูล mini-pos-demo ตอนนี้)
-- ใช้เฉพาะตอนสร้างฐานข้อมูลใหม่: วางใน Supabase → SQL Editor → New query แล้วกด Run (หลังรัน schema.sql แล้ว)

insert into products (sku, name, price, stock, unit) values
('TS-COZY-L',  'เสื้อยืด Cozy Cream Cotton (L)',        320, 20, 'ตัว'),
('TS-COZY-M',  'เสื้อยืด Cozy Cream Cotton (M)',        320, 20, 'ตัว'),
('TS-MINI-L1', 'เสื้อยืด Minimal White (L)',            290, 20, 'ตัว'),
('TS-MINI-L2', 'เสื้อยืด Minimal White Cream (L)',      290, 20, 'ตัว'),
('TS-MINI-M1', 'เสื้อยืด Minimal White (M)',            290, 20, 'ตัว'),
('TS-MINI-M2', 'เสื้อยืด Minimal White Cream (M)',      290, 20, 'ตัว'),
('TS-STRT-L',  'เสื้อยืด Street Oversize Graphic (L)',  350, 15, 'ตัว'),
('TS-STRT-XL', 'เสื้อยืด Street Oversize Graphic (XL)', 350, 15, 'ตัว'),
('TS-VINT-L',  'เสื้อยืด Vintage Retro Wash (L)',       390, 10, 'ตัว'),
('TS-VINT-XL', 'เสื้อยืด Vintage Retro Wash (XL)',      390, 10, 'ตัว');
