import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Blocks({ data }) {
  const [blocks, setBlocks] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const HeightRef = useRef(0);
  const LatestBlockHeight = useRef(0);
  const isLoading = useRef(false);

  const MINUTE_MS = 1000;

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
      if (entries[0].isIntersecting) {
        setPageNumber((prevPageNumber) => prevPageNumber + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, []); // Removed isLoading.current from dependencies as it is a ref

  useEffect(() => {
    if (data && data.length > 0) {
      setBlocks(data);
      HeightRef.current = data[data.length - 1].Height;
      LatestBlockHeight.current = data.Height;
    } else {
      LatestBlockHeight.current = -1;
    }
  }, [data]);

  useEffect(() => {
    if (pageNumber > 0) loadOnScroll();
  }, [pageNumber]);

  useEffect(() => {
    const interval = setInterval(() => loadLatestBlocks(), MINUTE_MS);
    return () => clearInterval(interval);
  }, []);
  // --- KEEPING YOUR LOGIC END ---

  return (
    <div style={{ 
      backgroundColor: '#020617', minHeight: '100vh', color: 'white', 
      padding: '120px 5% 50px 5%', fontFamily: 'sans-serif' 
    }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <div style={{ width: '4px', height: '35px', backgroundColor: '#38bdf8', borderRadius: '10px', boxShadow: '0 0 10px #38bdf8' }}></div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Latest Blocks</h1>
      </div>

      {/* Table Container */}
      <div style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', 
        border: '1px solid #1e293b', overflow: 'hidden', backdropFilter: 'blur(10px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        {/* Table Header Row */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 1fr', 
          backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '20px',
          borderBottom: '1px solid #334155', color: '#94a3b8', 
          fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em'
        }}>
          <div style={{ textAlign: 'center' }}>Height</div>
          <div style={{ paddingLeft: '20px' }}>Block Hash</div>
          <div style={{ textAlign: 'center' }}>Transactions</div>
          <div style={{ textAlign: 'right', paddingRight: '20px' }}>Size</div>
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
                  display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 1fr', 
                  padding: '24px 20px', borderBottom: '1px solid #1e293b',
                  alignItems: 'center', transition: 'background 0.2s cursor'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Block Height Column */}
                <div style={{ textAlign: 'center', color: '#38bdf8', fontWeight: '900', fontSize: '1.1rem' }}>
                  #{block.Height}
                </div>

                {/* Hash Column */}
                <div style={{ paddingLeft: '20px', overflow: 'hidden' }}>
                  <Link href={`/blocks/block?blockhash=${block.blockHeader.blockhash}`} passHref>
                    <a style={{ 
                      color: '#e2e8f0', textDecoration: 'none', 
                      fontFamily: 'monospace', fontSize: '0.9rem', display: 'block',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {block.blockHeader.blockhash}
                    </a>
                  </Link>
                </div>

                {/* Transaction Column */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ 
                    backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '6px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 'bold', color: '#7dd3fc', border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}>
                    {block.Transactions ? block.Transactions.length : block.TxCount} TXs
                  </span>
                </div>

                {/* Size Column */}
                <div style={{ textAlign: 'right', paddingRight: '20px', color: '#94a3b8', fontWeight: 'bold', fontFamily: 'monospace' }}>
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

export async function getServerSideProps(context) {
  try {
    const res = await fetch("http://localhost:3000/api/fetchBlocks");
    const data = await res.json();
    return { props: { data: Array.isArray(data) ? data : [] } };
  } catch (error) {
    console.error("SSR Fetch Error:", error);
    return { props: { data: [] } };
  }
}