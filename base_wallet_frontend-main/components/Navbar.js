import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '15px 10px' : '15px 40px',
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    borderBottom: '1px solid #222',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    gap: isMobile ? '15px' : '0'
  };

  return (
    <nav style={navStyle}>
      
      {/* 1. LOGO SECTION - Updated Path */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', width: '35px', height: '35px' }}>
          <Image 
            src="/logo.png" // This points directly to the public folder
            alt="ChainExplorer Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <span style={{ 
          color: 'white', 
          fontWeight: '900', 
          fontSize: isMobile ? '0.9rem' : '1.1rem', 
          letterSpacing: '-1px' 
        }}>
          CHAINEXPLORER
        </span>
      </div>

      {/* 2. NAVIGATION LINKS - Responsive Gap */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '15px' : '30px',
        fontSize: isMobile ? '12px' : '14px'
      }}>
        <Link href="/" passHref><a style={linkStyle}>Home</a></Link>
        <Link href="/blocks" passHref><a style={linkStyle}>Blocks</a></Link>
        <Link href="/sendBTC" passHref><a style={linkStyle}>Transfer</a></Link>
        <Link href="/mempool" passHref><a style={linkStyle}>Mempool</a></Link>
      </div>

      {/* 3. SOCIAL BUTTONS - Shrunk for Mobile */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <SocialButton href="https://facebook.com" color="#1877F2" icon="F" />
        <SocialButton href="https://twitter.com" color="#000" icon="T" border="#333" />
        <SocialButton href="https://instagram.com" color="linear-gradient(45deg, #f09433, #dc2743, #bc1888)" icon="I" />
      </div>
    </nav>
  );
}

// Helper Styles & Components
const linkStyle = { 
  color: '#94a3b8', 
  textDecoration: 'none', 
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const SocialButton = ({ href, color, icon, border }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <button style={{
      width: '30px', height: '30px', background: color, 
      border: border ? `1px solid ${border}` : 'none', 
      color: 'white', borderRadius: '6px', cursor: 'pointer', 
      fontSize: '10px', fontWeight: 'bold'
    }}>{icon}</button>
  </a>
);
