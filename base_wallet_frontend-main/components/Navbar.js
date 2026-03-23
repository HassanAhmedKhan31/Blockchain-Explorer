import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // Dynamic padding to prevent text cutting
      padding: isMobile ? '20px 10px' : '0 40px',
      height: isMobile ? 'auto' : '80px', 
      backgroundColor: '#050505',
      borderBottom: '1px solid #222',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2000,
      gap: isMobile ? '15px' : '0'
    }}>
      
      {/* 1. LOGO - Explicit Path for your structure */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/logo.png" 
          alt="ChainExplorer" 
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            objectFit: 'contain',
            display: 'block' 
          }} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Logo'; }}
        />
        <span style={{ 
          color: 'white', 
          fontWeight: '900', 
          fontSize: isMobile ? '1rem' : '1.2rem', 
          letterSpacing: '-1px' 
        }}>
          CHAINEXPLORER
        </span>
      </div>

      {/* 2. NAVIGATION LINKS - Responsive Spacing */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '15px' : '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: isMobile ? '10px 0' : '0'
      }}>
        <Link href="/" passHref><a style={linkStyle}>Home</a></Link>
        <Link href="/blocks" passHref><a style={linkStyle}>Blocks</a></Link>
        <Link href="/sendBTC" passHref><a style={linkStyle}>Transfer</a></Link>
        <Link href="/mempool" passHref><a style={linkStyle}>Mempool</a></Link>
      </div>

      {/* 3. SOCIALS */}
      <div style={{ display: 'flex', gap: '10px', paddingBottom: isMobile ? '10px' : '0' }}>
        <SocialButton href="https://facebook.com" color="#1877F2" icon="F" />
        <SocialButton href="https://twitter.com" color="#000" icon="T" border="#333" />
        <SocialButton href="https://instagram.com" color="linear-gradient(45deg, #f09433, #dc2743, #bc1888)" icon="I" />
      </div>
    </nav>
  );
}

const linkStyle = { 
  color: '#aaa', 
  textDecoration: 'none', 
  fontWeight: 'bold', 
  fontSize: '14px',
  whiteSpace: 'nowrap' // Prevents words from cutting/wrapping
};

const SocialButton = ({ href, color, icon, border }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <button style={{
      width: '35px', height: '35px', background: color, 
      border: border ? `1px solid ${border}` : 'none', 
      color: 'white', borderRadius: '8px', cursor: 'pointer'
    }}>{icon}</button>
  </a>
);
