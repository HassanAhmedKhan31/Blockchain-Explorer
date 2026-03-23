import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      backgroundColor: '#020617', 
      color: 'white', 
      overflowX: 'hidden',
      fontFamily: 'sans-serif',
      // FIX: Added responsive padding to clear the fixed navbar
      paddingTop: isMobile ? '160px' : '100px' 
    }}>
      <Head>
        <title>ChainExplorer | Professional Analytics</title>
      </Head>

      {/* BACKGROUND DECORATIVE GLOWS */}
      <div style={{ 
        position: 'absolute', top: '-10%', left: '-10%', width: isMobile ? '80%' : '40%', height: '40%', 
        backgroundColor: 'rgba(14, 165, 233, 0.15)', filter: 'blur(120px)', borderRadius: '50%' 
      }}></div>

      <main style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '1200px', 
        margin: '0 auto', 
        // FIX: Reduced main padding since parent div handles the top gap
        padding: isMobile ? '20px 20px 50px 20px' : '60px 40px 100px 40px' 
      }}>
        
        <div style={{ maxWidth: '900px', textAlign: isMobile ? 'center' : 'left' }}>
          
          {/* Badge */}
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', marginBottom: '32px',
            border: '1px solid rgba(14, 165, 233, 0.3)', backgroundColor: 'rgba(14, 165, 233, 0.1)',
            borderRadius: '9999px', color: '#38bdf8', fontSize: '11px', fontWeight: '900',
            textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
            <span style={{ height: '8px', width: '8px', backgroundColor: '#38bdf8', borderRadius: '50%', display: 'inline-block' }}></span>
            Live Blockchain Data
          </div>
          
          {/* Heading */}
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 9vw, 5rem)', 
            fontWeight: '900', 
            lineHeight: '1.1', 
            marginBottom: '24px', 
            letterSpacing: '-0.03em' 
          }}>
            Blockchain <br />
            <span style={{ 
              background: 'linear-gradient(to right, #38bdf8, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Explorer & Analytics 
            </span>
          </h1>

          <p style={{ 
            fontSize: isMobile ? '1.1rem' : '1.25rem', 
            color: '#94a3b8', 
            maxWidth: '650px', 
            marginBottom: '48px', 
            lineHeight: '1.6',
            margin: isMobile ? '0 auto 48px auto' : '0 0 48px 0'
          }}>
            Access real-time Bitcoin (BTC) historical prices, recently mined blocks, 
            and live mempool data with our high-speed analytics engine.
          </p>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: '16px',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <Link href="/blocks" passHref>
              <button style={{ 
                backgroundColor: '#0284c7', color: 'white', padding: '18px 40px', 
                borderRadius: '16px', fontWeight: '900', border: 'none', cursor: 'pointer',
                width: isMobile ? '100%' : 'auto', fontSize: '14px',
                boxShadow: '0 0 30px rgba(14, 165, 233, 0.3)'
              }}>
                START EXPLORING
              </button>
            </Link>
            <Link href="/mempool" passHref>
              <button style={{ 
                backgroundColor: '#0f172a', border: '1px solid #334155', color: 'white', 
                padding: '18px 40px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer',
                width: isMobile ? '100%' : 'auto', fontSize: '14px'
              }}>
                VIEW MEMPOOL
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div style={{ 
          marginTop: isMobile ? '60px' : '100px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {[
            { name: "BTC Price", value: "$64,231.00", color: "#38bdf8" },
            { name: "Active Nodes", value: "14,502", color: "#a855f7" },
            { name: "Market Cap", value: "$1.2T", color: "#10b981" },
          ].map((stat) => (
            <div key={stat.name} style={{ 
              padding: '32px', 
              borderRadius: '24px', 
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              borderLeft: `4px solid ${stat.color}`, 
              borderTop: '1px solid #1e293b', 
              borderRight: '1px solid #1e293b', 
              borderBottom: '1px solid #1e293b',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.2s ease-in-out'
            }}>
              <p style={{ 
                color: '#64748b', fontSize: '11px', fontWeight: '900', 
                textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.15em' 
              }}>
                {stat.name}
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
