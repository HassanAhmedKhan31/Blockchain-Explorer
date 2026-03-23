import { useRef, useState, useEffect } from "react";
import CreateKeys from "../../base_wallet_backend-main/core/wallet";
import { io } from "socket.io-client";

export default function SendBTC() {
  const COIN = 100000000;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [publicAddress, setPublicAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const privateKey = useRef("");

  useEffect(() => {
    // Handle Responsiveness
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Fetch Balance logic
    const fetchBalance = async () => {
      if (publicAddress && publicAddress !== "Invalid Private Key") {
        setLoadingBalance(true);
        try {
          const res = await fetch(`/api/getBalance?address=${publicAddress}`);
          const result = await res.json();
          setBalance(result.balance || 0);
        } catch (error) {
          console.error("Error fetching balance:", error);
        } finally {
          setLoadingBalance(false);
        }
      } else {
        setBalance(0);
      }
    };
    fetchBalance();

    return () => window.removeEventListener("resize", handleResize);
  }, [publicAddress]);

  const generateAddress = (e) => {
    const value = e.target.value;
    if (value) {
      try {
        const hexValue = value.startsWith("0x") ? value : `0x${value}`;
        privateKey.current = BigInt(hexValue);
        const keys = new CreateKeys(privateKey.current);
        setPublicAddress(keys.createPublicKey());
      } catch (err) {
        setPublicAddress("Invalid Private Key");
      }
    } else {
      setPublicAddress("");
      privateKey.current = "";
    }
  };

  const resetValue = (form) => {
    form.toAddress.value = "";
    form.Amount.value = "";
    form.priv.value = "";
    setPublicAddress("");
    setBalance(0);
    privateKey.current = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const amountInSatoshis = parseFloat(form.Amount.value) * COIN;
    
    if (amountInSatoshis / COIN > balance) {
      alert("Insufficient balance!");
      return;
    }
    
    const data = {
      priv: form.priv.value,
      fromAddress: publicAddress,
      toAddress: form.toAddress.value,
      Amount: amountInSatoshis,
    };

    try {
      const response = await fetch("/api/unspentTx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok && result.data) {
        const socket = io("http://localhost:3600");
        socket.on("connect", () => {
          socket.emit("ADD_TX_IN_MEMPOOL", result.data);
          setIsSubmitted(true);
          resetValue(form);
          setTimeout(() => {
            socket.disconnect();
            setIsSubmitted(false);
          }, 5000);
        });
      } else {
        alert(result.error || "Failed to prepare transaction.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Shared Styles with Responsive Adjustments
  const inputStyle = {
    width: '100%',
    backgroundColor: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    height: isMobile ? '55px' : '65px',
    color: 'white',
    paddingLeft: '20px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    marginBottom: '10px',
    marginLeft: '5px'
  };

  return (
    <div style={{ 
      backgroundColor: '#020617', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: isMobile ? '100px 15px 40px 15px' : '120px 20px',
      overflowX: 'hidden'
    }}>
      
      {/* Glow Effects */}
      <div style={{ 
        position: 'absolute', 
        width: isMobile ? '300px' : '500px', 
        height: isMobile ? '300px' : '500px', 
        backgroundColor: 'rgba(14, 165, 233, 0.05)', 
        filter: 'blur(120px)', 
        borderRadius: '50%' 
      }}></div>

      <div style={{ 
        maxWidth: '550px', 
        width: '100%', 
        backgroundColor: 'rgba(15, 23, 42, 0.7)', 
        border: '1px solid #1e293b', 
        borderRadius: isMobile ? '30px' : '40px', 
        padding: isMobile ? '25px' : '40px', 
        backdropFilter: 'blur(20px)', 
        position: 'relative', 
        zIndex: 10, 
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' 
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: isMobile ? '30px' : '45px' }}>
          <div style={{ width: '3px', height: isMobile ? '25px' : '35px', backgroundColor: '#0ea5e9', borderRadius: '10px', boxShadow: '0 0 15px #0ea5e9' }}></div>
          <div>
            <h1 style={{ color: 'white', fontSize: isMobile ? '22px' : '28px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Transfer Assets</h1>
            <p style={{ color: '#64748b', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0, marginTop: '4px' }}>Bitcoin Mainnet Network</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '30px' }}>
          
          <div>
            <label style={labelStyle}>Private Key (Hex)</label>
            <input 
              style={{...inputStyle, color: '#38bdf8', fontFamily: 'monospace'}} 
              onChange={generateAddress} 
              type="password" 
              name="priv" 
              placeholder="••••••••••••••••" 
              required 
            />
          </div>

          {publicAddress && (
            <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>Sender Address</label>
                <div style={{ 
                  backgroundColor: '#020617', 
                  padding: '15px', 
                  borderRadius: '12px', 
                  fontSize: isMobile ? '10px' : '12px', 
                  color: '#94a3b8', 
                  border: '1px solid #1e293b', 
                  fontFamily: 'monospace', 
                  wordBreak: 'break-all',
                  lineHeight: '1.4'
                }}>
                  {publicAddress}
                </div>
              </div>

              <div style={{ 
                padding: isMobile ? '20px' : '25px', 
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), transparent)', 
                border: '1px solid rgba(14, 165, 233, 0.2)', 
                borderRadius: '24px', 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '10px' : '0'
              }}>
                <div>
                  <p style={{ ...labelStyle, color: '#0ea5e9', marginLeft: 0, marginBottom: '5px' }}>Available Balance</p>
                  <p style={{ color: 'white', fontSize: isMobile ? '24px' : '32px', fontWeight: '900', margin: 0 }}>
                    {loadingBalance ? "..." : balance.toFixed(8)} <span style={{ fontSize: '14px', color: '#0ea5e9' }}>BTC</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Recipient Address</label>
            <input style={inputStyle} type="text" name="toAddress" placeholder="Paste destination address" required />
          </div>

          <div>
            <label style={labelStyle}>Amount to Send</label>
            <div style={{ position: 'relative' }}>
              <input style={{...inputStyle, fontWeight: 'bold'}} type="number" step="any" name="Amount" placeholder="0.00" required />
              <span style={{ position: 'absolute', right: '20px', top: isMobile ? '18px' : '22px', color: '#475569', fontWeight: '900', fontSize: '12px' }}>BTC</span>
            </div>
          </div>

          {isSubmitted && (
            <div style={{ padding: '15px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10b981', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
              ✓ Broadcast Successful: Check Mempool
            </div>
          )}

          <button 
            type="submit" 
            disabled={!publicAddress || publicAddress === "Invalid Private Key" || loadingBalance}
            style={{
              height: isMobile ? '55px' : '65px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '14px',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)',
              opacity: (publicAddress && publicAddress !== "Invalid Private Key") ? 1 : 0.3,
              marginTop: '10px'
            }}
          >
            INITIALIZE TRANSFER
          </button>
        </form>
      </div>
    </div>
  );
}
