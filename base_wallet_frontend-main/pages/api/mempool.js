import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Mempool() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Note: Make sure your socket server is running on 3600
    const client = io("http://localhost:3600");
    client.on("connect", () => client.emit("REMOVE_CONFIRMED_TX_FROM_MEMPOOL"));
    client.on("ADD_TX_IN_MEMPOOL", (data) => setTransactions((prev) => [data, ...prev]));
    return () => client.disconnect();
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#020617', 
      minHeight: '100vh', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '0',
      margin: '0',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* GLOW EFFECT */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '500px', height: '500px', backgroundColor: 'rgba(56, 189, 248, 0.08)', 
        filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 
      }}></div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h1 style={{ fontSize: '70px', fontWeight: '900', marginBottom: '10px', letterSpacing: '-3px' }}>
          Memory Pool
        </h1>
        <p style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '50px' }}>
          Live Network Monitoring
        </p>

        <div style={{ 
          backgroundColor: '#0f172a', 
          padding: '60px 100px', 
          borderRadius: '40px', 
          border: '1px solid #1e293b', 
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          display: 'inline-block'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>
            PENDING TRANSACTIONS
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
            <span style={{ fontSize: '100px', fontWeight: '900', color: '#38bdf8', lineHeight: 1 }}>
              {transactions.length}
            </span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>TXs</p>
              <p style={{ margin: 0, color: '#64748b' }}>In Queue</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>LIVE UPDATES ACTIVE</span>
        </div>
      </div>
    </div>
  );
}