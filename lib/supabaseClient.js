import { createClient } from '@supabase/supabase-js';

// ตัดช่องว่าง และตัด /rest/v1/ ที่มักติดมาตอนคัดลอก Project URL จาก Supabase ออกให้อัตโนมัติ
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  .trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

// ถ้ายังไม่ได้ตั้ง Environment Variables บน Vercel ให้ build ผ่านไปก่อน แต่แจ้งเตือนชัดๆ
// (หน้าเว็บจะดึงข้อมูลไม่ได้จนกว่าจะใส่ค่าครบแล้ว Redeploy)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ยังไม่ได้ตั้งค่า NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-env.supabase.co',
  supabaseAnonKey || 'missing-anon-key'
);
