import Link from "next/link";
import Image from "next/image";
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
      flexWrap: isMobile ? 'wrap' : 'nowrap', // Wraps links on mobile
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '15px 20px' : '20px 40px',
      backgroundColor: 'rgba(5, 5, 5, 0.9)',
      borderBottom: '1px solid #222',
      position: 'fixed', // Fixed so it stays at top during scroll
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      
      {/* Logo and Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', width: '40px', height: '40px' }}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            layout="fill" 
            objectFit="contain" 
            priority // Loads logo faster
            style={{ borderRadius: '8px' }}
          />
        </div>
        <span style={{ 
          color: 'white', 
          fontWeight: '900', 
          fontSize: isMobile ? '0.9rem' : '1.1rem', 
          letterSpacing: '-0.5px' 
        }}>
          CHAINEXPLORER
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ 
        display: 'flex', 
        gap: isMobile ? '15px' : '30px',
        order: isMobile ? 3 : 2, // Moves links to second row on mobile
        width: isMobile ? '100%' : 'auto',
        justifyContent: isMobile ? 'center' : 'center',
        marginTop: isMobile ? '15px' : '0',
        fontSize: isMobile ? '13px' : '15px'
      }}>
        <Link href="/" passHref><a style={linkStyle}>Home</a></Link>
        <Link href="/blocks" passHref><a style={linkStyle}>Blocks</a></Link>
        <Link href="/sendBTC" passHref><a style={linkStyle}>Transfer</a></Link>
        <Link href="/mempool" passHref><a style={linkStyle}>Mempool</a></Link>
      </div>

      {/* Action Buttons (Socials) */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        order: isMobile ? 2 : 3 
      }}>
        <SocialButton href="https://facebook.com" color="#1877F2" text="F" />
        <SocialButton href="https://twitter.com" color="#000" text="T" border="#333" />
        <SocialButton href="https://instagram.com" color="linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" text="I" />
      </div>
    </nav>
  );
}

// Sub-component for Social Buttons to keep code clean
const SocialButton = ({ href, color, text, border }) => (
  <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
    <button style={{
      width: '32px', height: '32px', background: color, 
      border: border ? `1px solid ${border}` : 'none', 
      color: 'white', borderRadius: '6px', cursor: 'pointer', 
      fontWeight: 'bold', fontSize: '12px'
    }}>{text}</button>
  </a>
);

const linkStyle = { 
  color: '#94a3b8', 
  textDecoration: 'none', 
  fontWeight: '600',
  transition: 'color 0.2s'
};
