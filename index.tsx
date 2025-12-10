import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- THEMES & CONFIG ---
const THEMES = {
  neon: { 
    id: 'neon', 
    name: 'Neon City', 
    bg: 'linear-gradient(-45deg, #FF3CAC, #784BA0, #2B86C5, #23d5ab)',
    accent: '#00f2fe'
  },
  sunset: { 
    id: 'sunset', 
    name: 'Sunset Strip', 
    bg: 'linear-gradient(-45deg, #FF512F, #DD2476, #F09819, #FF512F)',
    accent: '#FF512F'
  },
  ocean: { 
    id: 'ocean', 
    name: 'Cyber Ocean', 
    bg: 'linear-gradient(-45deg, #00c6ff, #0072ff, #1cb5e0, #000046)',
    accent: '#00c6ff'
  },
  forest: { 
    id: 'forest', 
    name: 'Toxic Jungle', 
    bg: 'linear-gradient(-45deg, #11998e, #38ef7d, #00b09b, #96c93d)',
    accent: '#38ef7d'
  },
  horror: { 
    id: 'horror', 
    name: 'Midnight', 
    bg: 'linear-gradient(-45deg, #2b0404, #850000, #1a0b0b, #000000)',
    accent: '#ff0000'
  }
};

const SNACKS = ["🍿 Popcorn", "🥤 Soda", "🌭 Hotdog", "🥨 Pretzel", "🍫 Candy", "🌮 Nachos"];
const LOADING_MSGS = ["✨ Conjuring wit...", "🎟️ Printing...", "🤔 Thinking...", "🎬 Director's cut...", "📡 Contacting AI..."];

// --- STYLES ---
const getStyles = (currentTheme) => `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&family=Poppins:wght@900&display=swap');

  :root {
    --accent-color: ${currentTheme.accent};
  }

  body {
    margin: 0;
    font-family: 'Nunito', sans-serif;
    background: ${currentTheme.bg};
    background-size: 300% 300%;
    animation: gradientBG 30s ease infinite;
    min-height: 100vh;
    color: #333;
    overflow-x: hidden;
    transition: background 1s ease;
  }

  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  h1, h2, h3 { font-family: 'Poppins', sans-serif; margin: 0; }

  .glass-panel {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      padding: 24px;
      margin-bottom: 20px;
      height: fit-content;
      transition: all 0.3s ease;
  }

  .title-box {
      text-align: center;
      margin-bottom: 30px;
      margin-top: 30px;
  }

  .hero-title {
      font-size: 3.5rem;
      font-weight: 900;
      color: white;
      text-shadow: 0 4px 10px rgba(0,0,0,0.3);
      letter-spacing: -1px;
      text-transform: uppercase;
  }

  /* Controls */
  .control-group {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }

  button {
      width: 100%;
      border-radius: 14px;
      height: 55px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      transition: all 0.1s;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: white;
      font-size: 0.95rem;
      font-family: 'Nunito', sans-serif;
      position: relative;
      overflow: hidden;
  }

  button:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
  }

  button:active {
      transform: translateY(1px);
  }

  button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
  }

  .btn-primary {
      background: linear-gradient(135deg, #FF9966 0%, #FF5E62 100%);
      box-shadow: 0 4px 15px rgba(255, 94, 98, 0.4);
  }

  .btn-secondary {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      box-shadow: 0 4px 15px rgba(0, 242, 254, 0.4);
  }

  .btn-vip {
      background: linear-gradient(135deg, #FDC830 0%, #F37335 100%);
      box-shadow: 0 4px 15px rgba(243, 115, 53, 0.4);
  }

  .btn-reset {
      background: rgba(0,0,0,0.1);
      color: #555;
      font-size: 0.8rem;
      height: 40px;
  }

  .theme-btn {
      flex: 1;
      min-width: 80px;
      height: 40px;
      font-size: 0.75rem;
      background: rgba(255,255,255,0.5);
      color: #444;
      border: 1px solid rgba(0,0,0,0.1);
  }
  .theme-btn.active {
      background: var(--accent-color);
      color: white;
      box-shadow: 0 0 10px var(--accent-color);
  }

  /* Queue Items */
  .ticket {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border-left: 6px solid #e0e0e0;
      position: relative;
      animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.9) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .ticket.vip {
      border-left: 6px solid #FFD700;
      background: #fffcf0;
      border: 2px solid #FFD700;
  }

  .ticket.active {
      background: linear-gradient(to right, #FFFDE4, #FFFFFF);
      border-left: 8px solid #00C9FF;
      transform: scale(1.02);
      z-index: 10;
      animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 201, 255, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(0, 201, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 201, 255, 0); }
  }

  .avatar { font-size: 2.5rem; margin-right: 16px; line-height: 1; }
  .info { flex-grow: 1; }
  .top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .id-tag { font-weight: 900; font-size: 1.2rem; color: #333; }
  .name { font-size: 1.1rem; color: #555; font-weight: 700; }
  .details { font-size: 0.8rem; color: #888; display: flex; gap: 10px; align-items: center; }
  
  .badge { 
      background: #eee; color: #555; padding: 4px 8px; 
      border-radius: 6px; font-size: 0.7rem; font-weight: 800;
      text-transform: uppercase;
  }
  .badge.live { background: #00C9FF; color: white; }
  .badge.vip-tag { background: #FFD700; color: #B8860B; margin-left: 5px; }

  /* History Items */
  .history-item {
      padding: 12px;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      animation: slideInLeft 0.5s ease-out forwards;
  }
  @keyframes slideInLeft { 
    from { opacity: 0; transform: translateX(-20px); } 
    to { opacity: 1; transform: translateX(0); } 
  }

  .history-msg {
      font-size: 0.85rem;
      color: #666;
      font-style: italic;
      margin-top: 4px;
      background: rgba(0,0,0,0.03);
      padding: 8px;
      border-radius: 8px;
      transition: all 0.5s ease;
  }
  
  .history-msg.pending {
      color: #aaa;
      background: transparent;
      animation: pulseText 1.5s infinite alternate;
  }
  
  @keyframes pulseText {
    from { opacity: 0.4; }
    to { opacity: 1; }
  }

  .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 20px;
  }
  .stat-box {
      text-align: center;
      padding: 15px;
      background: rgba(255,255,255,0.4);
      border-radius: 15px;
  }
  .stat-num { font-size: 2.5rem; font-weight: 900; color: #444; line-height: 1; }
  .stat-label { font-size: 0.7rem; color: #555; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

  .layout-grid {
    display: grid;
    grid-template-columns: 320px 1fr 320px;
    gap: 24px;
    padding: 0 24px 24px 24px;
    max-width: 1400px;
    margin: 0 auto;
    align-items: start;
  }

  @media (max-width: 1000px) {
    .layout-grid { grid-template-columns: 1fr; }
  }
`;

// --- DATA ---
const NAMES = ["Kai", "Luna", "Milo", "Nova", "Leo", "Mia", "Zane", "Cleo", "Jax", "Ivy", "Finn", "Ruby", "Aria", "Ezra", "Axel", "Iris"];
const AVATARS = ["🐼", "🦊", "🦄", "🦁", "🐯", "🐸", "🐙", "🐵", "🐨", "🐷", "🐻", "🐲", "🐹", "🐰", "👽", "🤖"];

interface Ticket {
  id: number;
  name: string;
  avatar: string;
  joined: string;
  snack: string;
  isVip: boolean;
}

interface ServedCustomer extends Ticket {
  served: string;
  message?: string;
  isPending?: boolean;
}

const App = () => {
  const [queue, setQueue] = useState<Ticket[]>([]);
  const [history, setHistory] = useState<ServedCustomer[]>([]);
  const [ticketId, setTicketId] = useState(101);
  const [theme, setTheme] = useState(THEMES.neon);
  const [vipMode, setVipMode] = useState(false);

  // Initialize Gemini AI
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const enqueue = () => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const snack = SNACKS[Math.floor(Math.random() * SNACKS.length)];
    
    const newTicket: Ticket = {
      id: ticketId,
      name,
      avatar,
      joined: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      snack,
      isVip: vipMode
    };

    setTicketId(prev => prev + 1);

    // VIP Logic: If VIP, insert at index 1 (behind current server), or 0 if empty
    if (vipMode && queue.length > 0) {
      const serving = queue[0];
      const waiting = queue.slice(1);
      setQueue([serving, newTicket, ...waiting]);
    } else {
      setQueue([...queue, newTicket]);
    }
    
    // Reset toggle
    if(vipMode) setVipMode(false);
  };

  const dequeue = () => {
    if (queue.length === 0) return;
    
    // 1. Snapshot the person and context
    const person = queue[0];
    const currentThemeName = theme.name; 
    
    // 2. Optimistic Update - Update UI immediately
    setQueue(prev => prev.slice(1));
    
    const tempMsg = LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)];
    const tempServedPerson: ServedCustomer = {
      ...person,
      served: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: tempMsg,
      isPending: true 
    };
    
    setHistory(prev => [tempServedPerson, ...prev]);

    // 3. Background AI Processing
    const fetchMessage = async () => {
        let finalMessage = "Enjoy the show!";
        try {
          const prompt = `Generate a witty, very short (max 7 words) cinema welcome for ${person.name}. Context: They ordered ${person.snack}. Theme: ${currentThemeName}.`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          if (response.text) {
            finalMessage = response.text.trim();
          }
        } catch (e) {
          console.error("AI Generation failed", e);
        }

        // 4. Update the specific history item with the result
        setHistory(prevHistory => prevHistory.map(item => 
          item.id === person.id 
          ? { ...item, message: finalMessage, isPending: false } 
          : item
        ));
    };

    // Fire and forget - don't await!
    fetchMessage();
  };

  const reset = () => {
    setQueue([]);
    setHistory([]);
    setTicketId(101);
  };

  // Calculate Wait Time (approx 2 mins per person)
  // Minus 1 because the first person is being served already
  const waitCount = queue.length > 1 ? queue.length - 1 : 0;
  const waitTime = waitCount * 2; 

  return (
    <>
      <style>{getStyles(theme)}</style>
      
      <div className="title-box">
        <div className="hero-title">🍿 {theme.name} CINEMA</div>
        <div style={{color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '1.2rem'}}>Smart Queue System</div>
      </div>

      <div className="layout-grid">
        
        {/* --- LEFT: CONTROLS --- */}
        <div className="glass-panel">
          
          <h3 style={{marginBottom: '10px', color:'#444'}}>🎨 Vibe Check</h3>
          <div className="control-group">
            {Object.values(THEMES).map(t => (
              <button 
                key={t.id}
                className={`theme-btn ${theme.id === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t)}
              >
                {t.name}
              </button>
            ))}
          </div>

          <hr style={{margin: '20px 0', opacity: 0.2}}/>

          <h3 style={{marginBottom: '15px', color:'#444'}}>🕹️ Actions</h3>
          
          <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
             <button 
               className={vipMode ? "btn-vip" : "btn-secondary"} 
               onClick={() => setVipMode(!vipMode)}
               style={{flex:1, fontSize:'0.8rem', opacity: vipMode ? 1 : 0.7}}
             >
               {vipMode ? "🌟 VIP ON" : "⚪ VIP OFF"}
             </button>
             <button 
               className={vipMode ? "btn-vip" : "btn-secondary"} 
               onClick={enqueue}
               style={{flex:2}}
             >
               {vipMode ? "Add VIP" : "Add Guest"}
             </button>
          </div>
          
          <div style={{height:'10px'}}></div>

          <button 
            className="btn-primary" 
            onClick={dequeue} 
            disabled={queue.length === 0}
            style={{opacity: (queue.length === 0) ? 0.6 : 1}}
          >
            🎟️ Serve Next
          </button>
          
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-num">{queue.length}</div>
              <div className="stat-label">In Line</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{waitTime}<span style={{fontSize:'1rem'}}>m</span></div>
              <div className="stat-label">Wait Time</div>
            </div>
          </div>

           <div style={{marginTop: '20px'}}>
             <button className="btn-reset" onClick={reset}>
               🔄 Reset System
             </button>
           </div>
        </div>

        {/* --- CENTER: QUEUE --- */}
        <div>
          {queue.length === 0 ? (
            <div className="glass-panel" style={{textAlign: 'center', padding: '60px 20px'}}>
              <div style={{fontSize: '5rem', opacity: 0.5, marginBottom: '20px', filter: 'grayscale(1)'}}>🍿</div>
              <h2 style={{color: '#555', marginBottom: '10px'}}>The Lobby is Empty</h2>
              <p style={{color: '#777'}}>Add customers to start the movie!</p>
            </div>
          ) : (
            queue.map((ticket, index) => {
              const isFirst = index === 0;
              return (
                <div key={ticket.id} className={`ticket ${isFirst ? 'active' : ''} ${ticket.isVip ? 'vip' : ''}`}>
                  <div className="avatar">{ticket.avatar}</div>
                  <div className="info">
                    <div className="top-row">
                      <div>
                        <span className="id-tag">#{ticket.id}</span>
                        {ticket.isVip && <span className="badge vip-tag">🌟 VIP</span>}
                      </div>
                      <span className={`badge ${isFirst ? 'live' : ''}`}>
                        {isFirst ? 'SERVING NOW' : `WAITING #${index}`}
                      </span>
                    </div>
                    <div className="name">{ticket.name}</div>
                    <div className="details">
                       <span>{ticket.snack}</span>
                       <span>•</span>
                       <span>{ticket.joined}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- RIGHT: HISTORY --- */}
        <div className="glass-panel">
          <h3 style={{marginBottom: '20px', color:'#444'}}>✅ Served</h3>
          
          {history.length === 0 && (
            <p style={{color:'#888', fontStyle:'italic'}}>No one has entered the theater yet.</p>
          )}

          <div style={{overflowY: 'auto', maxHeight: '600px'}}>
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div style={{fontSize: '2rem', marginRight: '15px'}}>{item.avatar}</div>
                <div style={{flexGrow: 1}}>
                  <div style={{fontWeight: 'bold', color: '#444'}}>
                    #{item.id} {item.name}
                    {item.isVip && <span style={{fontSize:'0.7rem', color:'#B8860B', marginLeft:'5px'}}>🌟</span>}
                  </div>
                  <div style={{fontSize: '0.7rem', color: '#999', textTransform: 'uppercase'}}>
                    Served: {item.served}
                  </div>
                  <div className={`history-msg ${item.isPending ? 'pending' : ''}`}>
                    "{item.message}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);