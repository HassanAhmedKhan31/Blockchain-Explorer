import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Mempool() {
  const socketRef = useRef();
  const [unconfirmedTxs, setunconfirmedTxs] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const COIN = 100000000;

  useEffect(() => {
    // Sync with the same 1024px breakpoint as the Navbar
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Socket Connection
    socketRef.current = io("http://localhost:3600");
    socketRef.current.on("connect", () => {
      socketRef.current.emit("SEND_MEMPOOL");
    });
    socketRef.current.on("SEND_MEMPOOL", (data) => {
      setunconfirmedTxs(data || {});
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const txKeys = Object.keys(unconfirmedTxs);

  return (
    <div style={{ 
      backgroundColor: '#020617', 
      minHeight: '100vh', 
      color: 'white', 
      // FIX: Clearance for the fixed stacked navbar
      paddingTop: isMobile ? '220px' : '130px', 
      paddingLeft: isMobile ? '15px' : '5%',
      paddingRight: isMobile ? '15px' : '5%',
      paddingBottom: '50px',
      fontFamily: 'sans-serif', 
      position: 'relative', 
      overflowX: 'hidden'
    }}>
      
      {/* Background Glow */}
      <div style={{ 
        position: 'absolute', top: '10%', right: '-5%', width: isMobile ? '250px' : '400px', 
        height: isMobile ? '250px' : '400px', backgroundColor: 'rgba(168, 85, 247, 0.1)', 
        filter: 'blur(100px)', borderRadius: '50%' 
      }}></div>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', marginBottom: '15px',
            border: '1px solid rgba(168, 85, 247, 0.3)', backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '9999px', color: '#a855f7', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
          }}>
            <span style={{ height: '6px', width: '6px', backgroundColor: '#a855f7', borderRadius: '50%', display: 'inline-block' }}></span>
            Live Mempool Monitor
          </div>
          <h1 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-1.5px' }}>
            Memory Pool
          </h1>
          <p style={{ color: '#64748b', fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
            Watching unconfirmed transactions
          </p>
        </div>

        {/* Status Card */}
        <div style={{ 
          margin: '0 auto 40px auto', backgroundColor: 'rgba(15, 23, 42, 0.6)', 
          padding: isMobile ? '30px 20px' : '40px', borderRadius: '30px', 
          border: '1px solid #1e293b', textAlign: 'center',
          backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>
            Queue Status
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '10px' : '20px' }}>
             <span style={{ fontSize: isMobile ? '4rem' : '6rem', fontWeight: '900', color: '#38bdf8', lineHeight: 1 }}>
               {txKeys.length}
             </span>
             <div style={{ textAlign: isMobile ? 'center' : 'left', width: isMobile ? '100%' : 'auto' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Transactions</p>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Waiting to be mined</p>
             </div>
          </div>
        </div>

        {/* Transaction Table */}
        {txKeys.length > 0 && (
          <div style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '20px', 
            border: '1px solid #1e293b', overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: isMobile ? '1fr 100px' : '3fr 1fr', 
              padding: '15px 20px', backgroundColor: 'rgba(30, 41, 59, 0.5)', 
              borderBottom: '1px solid #334155', color: '#94a3b8', 
              fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'
            }}>
              <div>Transaction ID</div>
              <div style={{ textAlign: 'right' }}>BTC Value</div>
            </div>

            {/* Table Body */}
            <div style={{ maxHeight: isMobile ? '400px' : '500px', overflowY: 'auto' }}>
              {txKeys.map((TxId) => {
                const Tx = unconfirmedTxs[TxId];
                let Amount = 0;
                Tx.tx_outs.forEach((txOut) => { Amount += parseInt(txOut.amount); });

                return (
                  <div key={Tx.TxId} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: isMobile ? '1fr 100px' : '3fr 1fr', 
                      padding: isMobile ? '15px 20px' : '20px 30px', 
                      borderBottom: '1px solid #1e293b', alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Link
                      href={{
                        pathname: `/unconfirmedtx`,
                        query: { Tx: JSON.stringify(Tx, (key, value) => value instanceof ArrayBuffer ? { type: 'ArrayBuffer', string: Buffer.from(value).toString("hex") } : value) },
                      }}
                      passHref
                    >
                      <a style={{ 
                        color: '#e2e8f0', textDecoration: 'none', fontFamily: 'monospace', 
                        fontSize: isMobile ? '0.75rem' : '0.9rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                      }}>
                        {Tx.TxId}
                      </a>
                    </Link>
                    <div style={{ textAlign: 'right', fontWeight: '900', color: '#10b981', fontSize: isMobile ? '0.8rem' : '1rem' }}>
                      {(Amount / COIN).toFixed(4)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {txKeys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569', fontSize: '1rem' }}>
            No unconfirmed transactions found.
          </div>
        )}
      </main>
    </div>
  );
}
