// ใช้ฝั่ง Server เท่านั้น (เรียกจาก app/api/notify/route.js) เพื่อไม่ให้ Bot Token หลุดไปอยู่ในเบราว์เซอร์

export const LOW_STOCK_THRESHOLD = 5;

// กันชื่อสินค้าที่มีตัวอักษร < > & ทำให้ parse_mode HTML ของ Telegram พัง
function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function baht(n) {
  return Number(n).toLocaleString('th-TH');
}

// items: [{ name, quantity, total_price, stock_left, unit }]
export function buildOrderMessage(items, soldAt) {
  // เซิร์ฟเวอร์ Vercel ใช้เวลา UTC ต้องระบุเขตเวลาไทยเอง
  const time = new Date(soldAt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const total = items.reduce((sum, i) => sum + Number(i.total_price), 0);

  const lines = items.map(i =>
    [
      `- สินค้า: ${escapeHtml(i.name)}`,
      `  จำนวน: ${i.quantity} ${escapeHtml(i.unit)} | ราคารวม: ${baht(i.total_price)} บาท`,
      `  สต๊อกคงเหลือปัจจุบัน: ${i.stock_left} ${escapeHtml(i.unit)}`,
    ].join('\n')
  );

  return [
    '🛍️ <b>มีรายการขายใหม่!</b>',
    '',
    ...lines,
    '',
    `💰 <b>ยอดรวมทั้งบิล: ${baht(total)} บาท</b>`,
    `🕒 เวลา: ${time}`,
  ].join('\n');
}

export function buildLowStockMessage(item) {
  return [
    '🚨 <b>[เตือนภัย] สต๊อกสินค้าใกล้หมด!</b>',
    `- สินค้า: ${escapeHtml(item.name)}`,
    `- คงเหลือเพียง: ${item.stock_left} ${escapeHtml(item.unit)}`,
    '⚠️ กรุณาเติมสต๊อกสินค้าด่วน!',
  ].join('\n');
}

export async function sendTelegramMessage(token, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram API error ${res.status}`);
  }
}
