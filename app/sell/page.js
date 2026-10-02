'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SellPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').gt('stock', 0);
    if (data) setProducts(data);
  }

  const currentProduct = products.find(p => p.id === selectedProduct);
  const totalPrice = currentProduct ? currentProduct.price * quantity : 0;

  async function handleSell(e) {
    e.preventDefault();
    if (!currentProduct) return;

    if (quantity > currentProduct.stock) {
      alert('จำนวนสินค้าคงเหลือไม่พอ');
      return;
    }

    // 1. บันทึกประวัติการขาย
    const { error: saleError } = await supabase.from('sales').insert([{
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      quantity: Number(quantity),
      total_price: totalPrice
    }]);

    if (saleError) {
      alert('เกิดข้อผิดพลาดในการขาย');
      return;
    }

    // 2. ตัดสต๊อกสินค้า
    await supabase.from('products').update({
      stock: currentProduct.stock - Number(quantity)
    }).eq('id', currentProduct.id);

    setMessage('ขายสินค้าสำเร็จ!');
    setSelectedProduct('');
    setQuantity(1);
    fetchProducts();
  }

  return (
    <div>
      <h2>ขายสินค้า</h2>
      <div className="card">
        {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
        <form onSubmit={handleSell} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>เลือกสินค้า: </label>
            <select 
              value={selectedProduct} 
              onChange={e => { setSelectedProduct(e.target.value); setMessage(''); }}
              style={{ width: '100%' }}
              required
            >
              <option value="">-- เลือกรายการสินค้า --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (฿{p.price}) - เหลือ {p.stock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>จำนวน: </label>
            <input 
              type="number" 
              min="1" 
              max={currentProduct ? currentProduct.stock : 1}
              value={quantity} 
              onChange={e => setQuantity(e.target.value)}
              style={{ width: '100%' }}
              required 
            />
          </div>

          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            ยอดรวม: ฿{totalPrice.toLocaleString()}
          </div>

          <button type="submit" style={{ padding: '10px', fontSize: '1rem' }}>ยืนยันการขาย</button>
        </form>
      </div>
    </div>
  );
}
