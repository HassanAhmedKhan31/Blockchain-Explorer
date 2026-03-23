import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Blocks({ data }) {
  const [blocks, setBlocks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const HeightRef = useRef(0);
  const LatestBlockHeight = useRef(0);
  const isLoading = useRef(false);

  useEffect(() => {
    // Sync with Navbar breakpoint
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- KEEPING YOUR LOGIC START ---
  const loadOnScroll = async () => {
    isLoading.current = true;
    try {
      const res = await fetch(`/api/fetchBlocks?blockHeight=${HeightRef.current}`);
      const newBlocks = await res.json();
      if (newBlocks && newBlocks.length !== 0) {
        HeightRef.current = newBlocks[newBlocks.length - 1].Height;
        setBlocks((prevBlocks) => [...prevBlocks, ...newBlocks]);
      }
    } catch (error) {
      console.error("Error loading more blocks:", error);
    } finally {
      isLoading.current = false;
    }
  };

  const loadLatestBlocks = async () => {
    try {
      const res = await fetch(`/api/fetchBlocks?blockHeight=${LatestBlockHeight.current}&latest=1`);
      const newBlocks = await res.json();
      if (newBlocks && newBlocks.length > 0 && newBlocks.Height > LatestBlockHeight.current) {
        setBlocks((prevBlocks) => {
          const existingIds = new Set(prevBlocks.map(b => b.blockHeader.blockhash));
          const filteredNew = newBlocks.filter(b => !existingIds.has(b.blockHeader.blockhash));
          return [...filteredNew, ...prevBlocks];
        });
        LatestBlockHeight.current = newBlocks.Height;
      }
    } catch (error) {
      console.error("Error loading latest blocks:", error);
    }
  };

  const observer = useRef();
  const lastBlockRef = useCallback((node) => {
    if (isLoading.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries.isIntersecting) {
        setPageNumber((prevPageNumber) => prevPageNumber + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setBlocks(data);
      HeightRef.current = data[data.length - 1].Height;
      LatestBlockHeight.current = data.Height;
    }
  }, [data]);

  useEffect(() => {
    if (pageNumber > 0) loadOnScroll();
  }, [pageNumber]);

  useEffect(() => {
    const interval = setInterval(() => loadLatestBlocks(), 10000); 
    return () => clearInterval(interval);
  }, []);
  // --- KEEPING YOUR LOGIC END ---

  // Responsive Grid Logic
  const gridTemplate = isMobile 
    ? "75px 1fr 70px" 
    : "1fr 3fr 1fr 1fr"; 

  return (
    <div style={{ 
      backgroundColor: '#020617', 
      minHeight: '100vh', 
      color: 'white', 
      // FIX: Clearance for the fixed stacked navbar
      paddingTop: isMobile ? '220px' : '120px', 
      paddingLeft: isMobile ? '15px' : '5%',
      paddingRight: isMobile ? '15px' : '5%',
      paddingBottom: '80px',
      fontFamily: 'sans-serif', 
      overflowX: 'hidden'
    }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <div style={{ width: '4px', height: isMobile ? '25px' : '35px', backgroundColor: '#38bdf8', borderRadius: '10px', boxShadow: '0 0 10px #38bdf8' }}></div>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Latest Blocks</h1>
      </div>

      {/* Table Container */}
      <div style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.4)', 
        borderRadius: isMobile ? '16px' : '24px', 
        border: '1px solid #1e293b', 
        overflow: 'hidden', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        {/* Table Header Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: gridTemplate, 
          backgroundColor: 'rgba(30, 41, 59, 0.8)', 
          padding: isMobile ? '12px 15px' : '20px',
          borderBottom: '1px solid #334155', 
          color: '#94a3b8', 
          fontSize: '10px', 
          fontWeight: '900', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em'
        }}>
          <div style={{ textAlign: isMobile ? 'left' : 'center' }}>Height</div>
          <div style={{ paddingLeft: isMobile ? '10px' : '20px' }}>Hash</div>
          {!isMobile && <div style={{ textAlign: 'center' }}>Transactions</div>}
          <div style={{ textAlign: 'right' }}>Size</div>
        </div>

        {/* Table Body */}
        <div>
          {blocks.map((block, index) => {
            const isLast = blocks.length === index + 1;
            return (
              <div
                ref={isLast ? lastBlockRef : null}
                key={block.blockHeader.blockhash}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: gridTemplate, 
                  padding: isMobile ? '15px' : '24px 20px', 
                  borderBottom: '1px solid #1e293b',
                  alignItems: 'center', 
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Height */}
                <div style={{ color: '#38bdf8', fontWeight: '900', fontSize: isMobile ? '0.8rem' : '1.1rem' }}>
                  #{block.Height}
                </div>

                {/* Hash */}
                <div style={{ paddingLeft: isMobile ? '0px' : '20px', overflow: 'hidden' }}>
                  <Link href={`/blocks/block?blockhash=${block.blockHeader.blockhash}`} passHref>
                    <a style={{ 
                      color: '#e2e8f0', textDecoration: 'none', 
                      fontFamily: 'monospace', fontSize: isMobile ? '0.7rem' : '0.9rem', display: 'block',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {block.blockHeader.blockhash}
                    </a>
                  </Link>
                </div>

                {/* Transactions (Desktop Only) */}
                {!isMobile && (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ 
                      backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '6px 14px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: 'bold', color: '#7dd3fc', border: '1px solid rgba(56, 189, 248, 0.2)'
                    }}>
                      {block.Transactions ? block.Transactions.length : block.TxCount} TXs
                    </span>
                  </div>
                )}

                {/* Size */}
                <div style={{ textAlign: 'right', color: '#94a3b8', fontWeight: 'bold', fontFamily: 'monospace', fontSize: isMobile ? '0.7rem' : '1rem' }}>
                  {block.BlockSize}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
