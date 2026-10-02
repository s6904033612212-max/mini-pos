import { createClient } from '@supabase/supabase-js';

// ตัดช่องว่าง และตัด /rest/v1/ ที่มักติดมาตอนคัดลอก Project URL จาก Supabase ออกให้อัตโนมัติ
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  .trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
