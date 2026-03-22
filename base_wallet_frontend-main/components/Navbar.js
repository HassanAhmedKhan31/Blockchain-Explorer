import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      backgroundColor: '#050505',
      borderBottom: '1px solid #222',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* Logo and Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Image src="/logo.png" width={50} height={50} style={{ borderRadius: '10px' }} alt="Logo" />
        <span style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-1px' }}>
          BLOCKCHAIN EXPLORER
        </span>
      </div>

      {/* Navigation Links - WITH GAPS */}
      <div style={{ display: 'flex', gap: '40px' }}>
        <Link href="/" passHref><a style={{ color: '#aaa', textDecoration: 'none', fontWeight: 'bold' }}>Home</a></Link>
        <Link href="/blocks" passHref><a style={{ color: '#aaa', textDecoration: 'none', fontWeight: 'bold' }}>Blocks</a></Link>
        <Link href="/sendBTC" passHref><a style={{ color: '#aaa', textDecoration: 'none', fontWeight: 'bold' }}>Transfer</a></Link>
        <Link href="/mempool" passHref><a style={{ color: '#aaa', textDecoration: 'none', fontWeight: 'bold' }}>Mempool</a></Link>
      </div>

     {/* Updated Action Buttons with Links and Colors */}
<div style={{ display: 'flex', gap: '10px' }}>
  <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
    <button style={{
      width: '40px', height: '40px', backgroundColor: '#1877F2', // Facebook Blue
      border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }}>F</button>
  </a>

  <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
    <button style={{
      width: '40px', height: '40px', backgroundColor: '#000000', // X Black
      border: '1px solid #333', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }}>T</button>
  </a>

  <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
    <button style={{
      width: '40px', height: '40px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', // Insta Gradient
      border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }}>I</button>
  </a>
</div>
    </nav>
  );
}