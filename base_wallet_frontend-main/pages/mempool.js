import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Mempool() {
  const socketRef = useRef();
  const [unconfirmedTxs, setunconfirmedTxs] = useState({}); // Start with object
  const COIN = 100000000;

  useEffect(() => {
    socketRef.current = io("http://localhost:3600");

    socketRef.current.on("connect", () => {
      console.log("Connected to Mempool Stream");
      socketRef.current.emit("SEND_MEMPOOL");
    });

    socketRef.current.on("SEND_MEMPOOL", (data) => {
      setunconfirmedTxs(data || {});
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const txKeys = Object.keys(unconfirmedTxs);

  return (
    <div style={{ 
      backgroundColor: '#020617', minHeight: '100vh', color: 'white', 
      padding: '120px 5% 50px 5%', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden'
    }}>
      
      {/* Background Neon Glow */}
      <div style={{ 
        position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', 
        backgroundColor: 'rgba(168, 85, 247, 0.1)', filter: 'blur(120px)', borderRadius: '50%' 
      }}></div>

      <main style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', marginBottom: '20px',
            border: '1px solid rgba(168, 85, 247, 0.3)', backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '9999px', color: '#a855f7', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase'
          }}>
            <span style={{ height: '8px', width: '8px', backgroundColor: '#a855f7', borderRadius: '50%', display: 'inline-block' }}></span>
            Live Mempool Monitor
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-2px' }}>Memory Pool</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Watching unconfirmed transactions across the network</p>
        </div>

        {/* Big Status Card */}
        <div style={{ 
          maxWidth: '800px', margin: '0 auto 50px auto', backgroundColor: 'rgba(15, 23, 42, 0.6)', 
          padding: '40px', borderRadius: '40px', border: '1px solid #1e293b', textAlign: 'center',
          backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '10px' }}>
            Queue Status
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
             <span style={{ fontSize: '6rem', fontWeight: '900', color: '#38bdf8', lineHeight: 1 }}>{txKeys.length}</span>
             <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Transactions</p>
                <p style={{ color: '#64748b', margin: 0 }}>Waiting to be mined</p>
             </div>
          </div>
        </div>

        {/* Transaction Table */}
        {txKeys.length > 0 && (
          <div style={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', 
            border: '1px solid #1e293b', overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'grid', gridTemplateColumns: '3fr 1fr', padding: '20px 30px', 
              backgroundColor: 'rgba(30, 41, 59, 0.5)', borderBottom: '1px solid #334155',
              color: '#94a3b8', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase'
            }}>
              <div>Transaction ID / Hash</div>
              <div style={{ textAlign: 'right' }}>Value (BTC)</div>
            </div>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {txKeys.map((TxId) => {
                const Tx = unconfirmedTxs[TxId];
                let Amount = 0;
                Tx.tx_outs.forEach((txOut) => { Amount += parseInt(txOut.amount); });

                return (
                  <div key={Tx.TxId} 
                    style={{ 
                      display: 'grid', gridTemplateColumns: '3fr 1fr', padding: '24px 30px', 
                      borderBottom: '1px solid #1e293b', alignItems: 'center'
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
                      <a style={{ color: '#e2e8f0', textDecoration: 'none', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {Tx.TxId}
                      </a>
                    </Link>
                    <div style={{ textAlign: 'right', fontWeight: '900', color: '#10b981' }}>
                      {(Amount / COIN).toFixed(8)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {txKeys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px', color: '#475569', fontSize: '1.2rem', fontWeight: 'bold' }}>
            No unconfirmed transactions found. The network is currently clear.
          </div>
        )}
      </main>
    </div>
  );
}