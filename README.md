# Mini POS

ระบบขายของหน้าร้านเล็กๆ — Next.js (App Router) + Supabase, deploy บน Vercel

| หน้า | หน้าที่ |
|---|---|
| `/` | รายการสินค้า: ดู / เพิ่ม / แก้ไข / ลบ |
| `/sell` | ขายสินค้า: เลือกหลายรายการลงตะกร้า ยอดรวมตัวใหญ่ด้านบน กดยืนยันแล้วตัดสต๊อกอัตโนมัติ |
| `/history` | ประวัติการขาย เรียงล่าสุดก่อน พร้อมยอดขายรวม |

## ฐานข้อมูล (Supabase)

- `supabase/schema.sql` — สร้างตาราง `products`, `sales` และ RLS policy (ขั้นตอน 5.3)
- `supabase/seed.sql` — ข้อมูลสินค้าตั้งต้น 10 SKU (ขั้นตอน 5.4)

## Deploy บน Vercel

1. https://vercel.com/new → Import repository `mini-pos` (Framework Preset: Next.js)
2. Environment Variables (ครบ 2 แถว):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` (ไม่มี `/rest/v1/` ต่อท้าย) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key (`eyJ...`) — ห้ามใช้ `service_role` |

3. **ไม่ต้อง**กด Add ในกล่อง Optional Integrations → Supabase
4. กด Deploy

> หมายเหตุ: ถ้าเผลอวาง URL ที่มี `/rest/v1/` หรือช่องว่างติดมา `lib/supabaseClient.js` จะตัดออกให้อัตโนมัติ
