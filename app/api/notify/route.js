import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import {
  LOW_STOCK_THRESHOLD,
  buildOrderMessage,
  buildLowStockMessage,
  sendTelegramMessage,
} from '@/lib/telegram';

// รับแค่ id ของรายการขายที่เพิ่งบันทึก แล้วดึงข้อมูลจริงจาก Supabase เอง
// (ไม่รับข้อความจากเบราว์เซอร์ตรงๆ กันคนยิงข้อความมั่วๆ เข้า Channel)
export async function POST(request) {
  const token = (process.env.TELEGRAM_BOT_TOKEN || process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID || process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '').trim();
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: 'ยังไม่ได้ตั้งค่า TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID' }, { status: 503 });
  }

  const { saleIds } = await request.json().catch(() => ({}));
  if (!Array.isArray(saleIds) || saleIds.length === 0 || saleIds.length > 100) {
    return NextResponse.json({ ok: false, error: 'saleIds ไม่ถูกต้อง' }, { status: 400 });
  }

  // แจ้งเตือนได้เฉพาะรายการขายที่เพิ่งเกิดขึ้นใน 5 นาทีล่าสุด
  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('product_id, product_name, quantity, total_price, sold_at')
    .in('id', saleIds)
    .gte('sold_at', since);

  if (salesError || !sales || sales.length === 0) {
    return NextResponse.json({ ok: false, error: 'ไม่พบรายการขาย' }, { status: 404 });
  }

  // สต๊อกคงเหลือหลังตัดแล้ว
  const { data: products } = await supabase
    .from('products')
    .select('id, stock, unit')
    .in('id', sales.map(s => s.product_id).filter(Boolean));

  const items = sales.map(s => {
    const p = (products || []).find(p => p.id === s.product_id);
    return {
      name: s.product_name,
      quantity: s.quantity,
      total_price: s.total_price,
      stock_left: p ? p.stock : '-',
      unit: p ? p.unit : 'ชิ้น',
    };
  });

  try {
    // งานที่ 1: แจ้งเตือนออเดอร์ใหม่ (1 ข้อความต่อ 1 บิล)
    await sendTelegramMessage(token, chatId, buildOrderMessage(items, sales[0].sold_at));

    // งานที่ 2: แจ้งเตือนสต๊อกใกล้หมด (แยกข้อความ สินค้าละ 1 ข้อความ)
    for (const item of items) {
      if (typeof item.stock_left === 'number' && item.stock_left <= LOW_STOCK_THRESHOLD) {
        await sendTelegramMessage(token, chatId, buildLowStockMessage(item));
      }
    }
  } catch (err) {
    console.error('Telegram notify failed:', err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
