import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
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
      padding: isMobile ? '15px 10px' : '15px 40px',
      backgroundColor: 'rgba(5, 5, 5, 0.98)', // Slightly darker for better contrast
      borderBottom: '1px solid #222',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2000, // Very high to stay above everything
      backdropFilter: 'blur(10px)',
      gap: isMobile ? '10px' : '0'
    }}>
      
      {/* 1. LOGO SECTION - Using standard <img> for better compatibility */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="/logo.png" 
          alt="ChainExplorer" 
          style={{ width: '35px', height: '35px', borderRadius: '8px', objectFit: 'contain' }} 
        />
        <span style={{ 
          color: 'white', 
          fontWeight: '900', 
          fontSize: isMobile ? '0.85rem' : '1.1rem', 
          letterSpacing: '-0.5px' 
        }}>
          CHAINEXPLORER
        </span>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '12px' : '30px',
        fontSize: isMobile ? '11px' : '14px'
      }}>
        <Link href="/" passHref><a style={linkStyle}>Home</a></Link>
        <Link href="/blocks" passHref><a style={linkStyle}>Blocks</a></Link>
        <Link href="/sendBTC" passHref><a style={linkStyle}>Transfer</a></Link>
        <Link href="/mempool" passHref><a style={linkStyle}>Mempool</a></Link>
      </div>

      {/* 3. SOCIALS */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <SocialButton href="https://facebook.com" color="#1877F2" icon="F" />
        <SocialButton href="https://twitter.com" color="#000" icon="T" border="#333" />
        <SocialButton href="https://instagram.com" color="linear-gradient(45deg, #f09433, #dc2743, #bc1888)" icon="I" />
      </div>
    </nav>
  );
}

const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontWeight: 'bold', textTransform: 'uppercase' };

const SocialButton = ({ href, color, icon, border }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <button style={{
      width: '28px', height: '28px', background: color, 
      border: border ? `1px solid ${border}` : 'none', 
      color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '10px'
    }}>{icon}</button>
  </a>
);
