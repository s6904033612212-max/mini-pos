import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Mini POS',
  description: 'ระบบขายของหน้าร้านขนาดเล็ก',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>รายการสินค้า</Link>
            <Link href="/sell" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>ขายสินค้า</Link>
            <Link href="/history" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>ประวัติการขาย</Link>
          </div>
        </nav>
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
