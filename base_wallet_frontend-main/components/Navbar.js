import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Breakpoint at 1024px for tablets/phones
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
      // Compact padding for mobile to save space
      padding: isMobile ? '10px 10px' : '0 40px',
      height: isMobile ? 'auto' : '80px', 
      backgroundColor: '#050505',
      borderBottom: '1px solid #222',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2000,
      // Reduced gap for mobile
      gap: isMobile ? '8px' : '0'
    }}>
      
      {/* 1. LOGO - Optimized Path */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: isMobile ? '5px' : '0' }}>
        <img 
          src="/logo.png" 
          alt="ChainExplorer" 
          style={{ 
            width: isMobile ? '30px' : '40px', 
            height: isMobile ? '30px' : '40px', 
            borderRadius: '6px', 
            objectFit: 'contain',
            display: 'block' 
          }} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Logo'; }}
        />
        <span style={{ 
          color: 'white', 
          fontWeight: '900', 
          fontSize: isMobile ? '0.9rem' : '1.2rem', 
          letterSpacing: '-1px' 
        }}>
          CHAINEXPLORER
        </span>
      </div>

      {/* 2. NAVIGATION LINKS - Responsive Spacing */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '12px' : '30px',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        padding: isMobile ? '5px 0' : '0'
      }}>
        <Link href="/" passHref><a style={linkStyle}>Home</a></Link>
        <Link href="/blocks" passHref><a style={linkStyle}>Blocks</a></Link>
        <Link href="/sendBTC" passHref><a style={linkStyle}>Transfer</a></Link>
        <Link href="/mempool" passHref><a style={linkStyle}>Mempool</a></Link>
      </div>

      {/* 3. SOCIALS - Smaller on Mobile */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        paddingBottom: isMobile ? '10px' : '0',
        marginTop: isMobile ? '2px' : '0' 
      }}>
        <SocialButton href="https://facebook.com" color="#1877F2" icon="F" isMobile={isMobile} />
        <SocialButton href="https://twitter.com" color="#000" icon="T" border="#333" isMobile={isMobile} />
        <SocialButton href="https://instagram.com" color="linear-gradient(45deg, #f09433, #dc2743, #bc1888)" icon="I" isMobile={isMobile} />
      </div>
    </nav>
  );
}

const linkStyle = { 
  color: '#aaa', 
  textDecoration: 'none', 
  fontWeight: 'bold', 
  fontSize: '13px', // Slightly smaller for better fit
  whiteSpace: 'nowrap' 
};

const SocialButton = ({ href, color, icon, border, isMobile }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <button style={{
      width: isMobile ? '28px' : '35px', 
      height: isMobile ? '28px' : '35px', 
      background: color, 
      border: border ? `1px solid ${border}` : 'none', 
      color: 'white', 
      borderRadius: '6px', 
      cursor: 'pointer',
      fontSize: isMobile ? '10px' : '12px'
    }}>{icon}</button>
  </a>
);
