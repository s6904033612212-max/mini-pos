'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: '', name: '', price: '', stock: '', unit: 'ชิ้น' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (!error) setProducts(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await supabase.from('products').update({
        sku: form.sku,
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit
      }).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('products').insert([{
        sku: form.sku,
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        unit: form.unit
      }]);
    }
    setForm({ sku: '', name: '', price: '', stock: '', unit: 'ชิ้น' });
    fetchProducts();
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({ sku: product.sku, name: product.name, price: product.price, stock: product.stock, unit: product.unit });
  }

  async function handleDelete(id) {
    if (confirm('ยืนยันการลบสินค้านี้?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  return (
    <div>
      <h2>รายการสินค้า</h2>
      <div className="card">
        <h3>{editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required />
          <input placeholder="ชื่อสินค้า" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input type="number" placeholder="ราคา" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input type="number" placeholder="จำนวนคงเหลือ" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input placeholder="หน่วย (เช่น ขวด, ชิ้น)" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">{editingId ? 'อัปเดต' : 'บันทึก'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ sku: '', name: '', price: '', stock: '', unit: 'ชิ้น' }); }}>ยกเลิก</button>}
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>คงเหลือ</th>
            <th>หน่วย</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.unit}</td>
              <td>
                <button onClick={() => handleEdit(p)} style={{ marginRight: '4px' }}>แก้ไข</button>
                <button onClick={() => handleDelete(p.id)} style={{ backgroundColor: '#e53e3e' }}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
