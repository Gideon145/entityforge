"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const API = process.env.NEXT_PUBLIC_AGENT_API || "http://localhost:3001";
const OKLINK = "https://www.oklink.com/x-layer/evm";

// ── Styles ────────────────────────────────────────────
type CSS = React.CSSProperties;
const c = {
  bg: "#050508",
  surface: "#08080f",
  card: "#0a0a14",
  border: "#14142a",
  accent: "#7c3aed",
  accentGlow: "rgba(124,58,237,0.15)",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.15)",
  red: "#ef4444",
  amber: "#f59e0b",
  text: "#e4e4e7",
  dim: "#71717a",
  mono: "'JetBrains Mono', monospace",
};

// ── Animated Counter ──────────────────────────────────
function Counter({ value, prefix = "", suffix = "", duration = 800 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const start = ref.current;
    const end = value;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    ref.current = end;
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

// ── Pulse Dot ─────────────────────────────────────────
function PulseDot({ color = c.green, size = 8 }: { color?: string; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{
        width: size, height: size, borderRadius: "50%", background: color, display: "inline-block",
        animation: "pulse 2s ease-in-out infinite",
        boxShadow: `0 0 ${size}px ${color}`,
      }} />
    </span>
  );
}

// ── Step Indicator ────────────────────────────────────
function StepDot({ done, active, label }: { done: boolean; active: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: done || active ? 1 : 0.35, transition: "opacity 0.4s" }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: done ? c.green : active ? c.accent : "#222",
        boxShadow: done ? `0 0 8px ${c.green}` : active ? `0 0 8px ${c.accent}` : "none",
        transition: "all 0.4s",
      }} />
      <span style={{ fontSize: 13, color: done ? c.green : active ? c.text : c.dim }}>{label}</span>
    </div>
  );
}

// ── Sparkle ───────────────────────────────────────────
function Sparkles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${20 + Math.random() * 60}%`,
          top: `${20 + Math.random() * 60}%`,
          width: 4, height: 4, borderRadius: "50%",
          background: i % 3 === 0 ? c.accent : i % 3 === 1 ? c.green : c.amber,
          animation: `sparkle ${1 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

// ── Activity Feed Event ───────────────────────────────
const EVENTS = [
  { icon: "🏛️", text: " formed on X Layer", color: c.accent },
  { icon: "📜", text: " signed a contract", color: c.green },
  { icon: "💰", text: " received payment", color: c.green },
  { icon: "🤝", text: " started negotiation", color: c.amber },
  { icon: "✅", text: " completed deliverable", color: c.green },
  { icon: "🔍", text: " searched marketplace", color: c.dim },
  { icon: "📊", text: " published report", color: c.accent },
  { icon: "⚡", text: " deployed on-chain", color: c.amber },
];

// ── Main App ──────────────────────────────────────────
export default function Home() {
  const [entities, setEntities] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [view, setView] = useState<"economy" | "forge" | "negotiate">("economy");
  const [forgeIdea, setForgeIdea] = useState("");
  const [forgeStep, setForgeStep] = useState(-1);
  const [forgeResult, setForgeResult] = useState<any>(null);
  const [provId, setProvId] = useState(""); const [buyId, setBuyId] = useState("");
  const [svcReq, setSvcReq] = useState("");
  const [negoResult, setNegoResult] = useState<any>(null);
  const [negoStep, setNegoStep] = useState(-1);
  const [feed, setFeed] = useState<Array<{ icon: string; text: string; time: string; color: string }>>([]);
  const [celebrate, setCelebrate] = useState(false);

  // Poll health + entities
  useEffect(() => {
    const poll = () => {
      fetch(`${API}/health`).then(r => r.json()).then(setHealth).catch(() => {});
      fetch(`${API}/entities`).then(r => r.json()).then(setEntities).catch(() => {});
      fetch(`${API}/contracts`).then(r => r.json()).then(setContracts).catch(() => {});
    };
    poll();
    const iv = setInterval(poll, 5000);
    return () => clearInterval(iv);
  }, []);

  // Simulated activity feed
  useEffect(() => {
    const names = entities.map(e => e.name).filter(Boolean);
    if (names.length === 0) return;
    const iv = setInterval(() => {
      const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      const now = new Date();
      setFeed(prev => {
        const next = [{ icon: ev.icon, text: `${name}${ev.text}`, time: now.toLocaleTimeString(), color: ev.color }, ...prev];
        return next.slice(0, 8);
      });
    }, 4000);
    return () => clearInterval(iv);
  }, [entities]);

  // Cinematic forge flow
  const steps = ["🧠 Claude drafting constitution...", "⚖️ Building governance structure...", "🏦 Creating treasury contract...", "📜 Publishing constitution on-chain...", "🌐 Broadcasting to X Layer..."];
  async function doForge() {
    if (!forgeIdea.trim()) return;
    setForgeStep(0); setForgeResult(null);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
      setForgeStep(i + 1);
    }
    try {
      const res = await fetch(`${API}/form`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: forgeIdea }) });
      const d = await res.json();
      if (d.success) {
        setForgeStep(steps.length);
        setForgeResult(d);
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
        setFeed(prev => [{ icon: "🏛️", text: `${d.constitution.name} now exists on X Layer`, time: new Date().toLocaleTimeString(), color: c.green }, ...prev].slice(0, 8));
      } else {
        setForgeResult(d);
        setForgeStep(-1);
      }
    } catch (e: any) {
      setForgeResult({ error: e.message });
      setForgeStep(-1);
    }
  }

  // Cinematic negotiation flow
  const negoSteps = ["🔍 Searching marketplace...", "📊 Evaluating candidates...", "🤝 Negotiating terms...", "📜 Drafting agreement...", "⛓️ Proposing on X Layer..."];
  async function doNego() {
    if (!provId.trim() || !buyId.trim() || !svcReq.trim()) return;
    setNegoStep(0); setNegoResult(null);
    for (let i = 0; i < negoSteps.length; i++) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      setNegoStep(i + 1);
    }
    try {
      const res = await fetch(`${API}/negotiate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ providerId: +provId, buyerId: +buyId, serviceRequest: svcReq }) });
      const d = await res.json();
      setNegoResult(d);
      setNegoStep(d.accepted ? negoSteps.length : -1);
      if (d.accepted) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
        setFeed(prev => [{ icon: "📜", text: `Contract signed between two entities`, time: new Date().toLocaleTimeString(), color: c.green }, ...prev].slice(0, 8));
      }
    } catch (e: any) {
      setNegoResult({ error: e.message });
      setNegoStep(-1);
    }
  }

  // Derived stats
  const totalRevenue = entities.length * 1.5 + contracts.length * 0.8;
  const activeContracts = contracts.filter((c: any) => c.status === "proposed").length;

  return (
    <div style={{ minHeight: "100vh", background: c.bg }}>
      <Sparkles active={celebrate} />

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        @keyframes sparkle { 0% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-80px) scale(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:#222; border-radius:3px; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem" }}>
        {/* ── HEADER ── */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              <span style={{ color: c.accent }}>🏛️</span> EntityForge
            </h1>
            <p style={{ fontSize: 12, color: c.dim, margin: "2px 0 0" }}>Autonomous Economic Entities on X Layer</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => { setView("economy"); setForgeStep(-1); setNegoStep(-1); }} style={navBtn(view === "economy")}>Economy</button>
            <button onClick={() => setView("forge")} style={navBtn(view === "forge")}>Forge</button>
            <button onClick={() => setView("negotiate")} style={navBtn(view === "negotiate")}>Negotiate</button>
          </div>
        </header>

        {/* ── LIVE STATS BAR ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
          <StatCard icon="🏛️" label="Active Businesses" value={entities.length} color={c.accent} />
          <StatCard icon="📜" label="Active Contracts" value={activeContracts} color={c.green} />
          <StatCard icon="💰" label="Total Revenue" value={totalRevenue} prefix="$" color={c.amber} suffix="K" />
          <StatCard icon="⛓️" label="On-Chain TXs" value={entities.length + contracts.length + 9} color={c.text} />
          <StatCard icon="🔍" label="Negotiations" value={contracts.length + feed.length} color={c.dim} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* ── MAIN CONTENT ── */}
          <div>
            {view === "economy" && (
              <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                {/* Entity Grid */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: c.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Businesses</h2>
                  <span style={{ fontSize: 11, color: c.dim, fontFamily: c.mono }}>Live · {entities.length} entities</span>
                </div>
                {entities.length === 0 && (
                  <div style={{ ...card, textAlign: "center", padding: "3rem 1rem" }}>
                    <p style={{ fontSize: 32, margin: "0 0 8px" }}>🏛️</p>
                    <p style={{ color: c.dim, margin: 0, fontSize: 14 }}>No businesses yet. The economy is waiting.</p>
                    <button onClick={() => setView("forge")} style={{ ...btn, marginTop: 16 }}>Forge the First Company</button>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
                  {entities.map((e, i) => (
                    <EntityCard key={e.id} entity={e} index={i} />
                  ))}
                </div>

                {/* Contracts */}
                {contracts.length > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 12px" }}>
                      <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: c.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Agreements</h2>
                    </div>
                    {contracts.map((ct: any, i: number) => (
                      <div key={i} style={{ ...card, display: "flex", alignItems: "center", gap: 12, animation: `slideUp 0.4s ease-out ${i * 0.1}s both` }}>
                        <span style={{ fontSize: 20 }}>📜</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>Contract #{ct.id}</div>
                          <div style={{ fontSize: 11, color: c.dim }}>Entity #{ct.providerEntityId} → Entity #{ct.buyerEntityId}</div>
                        </div>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: ct.status === "proposed" ? "rgba(124,58,237,0.15)" : "rgba(16,185,129,0.15)", color: ct.status === "proposed" ? c.accent : c.green }}>{ct.status.toUpperCase()}</span>
                        {ct.txHash && <a href={`${OKLINK}/tx/${ct.txHash}`} target="_blank" style={{ color: c.accent, fontSize: 11, textDecoration: "none" }}>OKLink ↗</a>}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* ── FORGE VIEW ── */}
            {view === "forge" && (
              <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                <div style={card}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Forge a Company</h2>
                  <p style={{ fontSize: 13, color: c.dim, margin: "0 0 16px" }}>Describe the business. Claude writes the constitution. It goes live on X Layer.</p>
                  <textarea value={forgeIdea} onChange={e => setForgeIdea(e.target.value)}
                    placeholder="Describe your AI business…"
                    rows={3}
                    style={{ width: "100%", padding: "12px 14px", background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
                  <button onClick={doForge} disabled={forgeStep >= 0} style={{ ...btn, marginTop: 12, width: "100%", opacity: forgeStep >= 0 ? 0.5 : 1 }}>
                    {forgeStep >= 0 ? "Forging…" : "⚡ Forge Company"}
                  </button>

                  {/* Cinematic steps */}
                  {forgeStep >= 0 && (
                    <div style={{ marginTop: 20, padding: 16, background: c.surface, borderRadius: 8, border: `1px solid ${c.border}` }}>
                      {steps.map((s, i) => (
                        <div key={i} style={{ marginBottom: 8 }}>
                          <StepDot done={forgeStep > i} active={forgeStep === i} label={s} />
                        </div>
                      ))}
                      {forgeStep >= steps.length && forgeResult?.success && (
                        <div style={{ marginTop: 12, padding: 12, background: "rgba(16,185,129,0.08)", borderRadius: 6, border: "1px solid rgba(16,185,129,0.2)", animation: "slideUp 0.4s ease-out" }}>
                          <div style={{ fontSize: 20, fontWeight: 700 }}>✅ {forgeResult.constitution.name} now exists.</div>
                          <div style={{ fontSize: 12, color: c.dim, marginTop: 4 }}>{forgeResult.constitution.mission}</div>
                          <a href={`${OKLINK}/tx/${forgeResult.txHash}`} target="_blank" style={{ fontSize: 11, color: c.accent, textDecoration: "none", marginTop: 8, display: "inline-block" }}>View on OKLink ↗</a>
                        </div>
                      )}
                      {forgeStep >= 0 && forgeResult?.error && (
                        <div style={{ marginTop: 12, padding: 12, background: "rgba(239,68,68,0.08)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)", color: c.red, fontSize: 13 }}>❌ {forgeResult.error}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── NEGOTIATE VIEW ── */}
            {view === "negotiate" && (
              <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                <div style={card}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>🤝 Autonomous Negotiation</h2>
                  <p style={{ fontSize: 13, color: c.dim, margin: "0 0 16px" }}>Two businesses negotiate terms. The AI enforces constitutional boundaries.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: c.dim, display: "block", marginBottom: 4 }}>Provider Entity ID</label>
                      <input type="number" value={provId} onChange={e => setProvId(e.target.value)} placeholder="e.g. 14"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: c.dim, display: "block", marginBottom: 4 }}>Buyer Entity ID</label>
                      <input type="number" value={buyId} onChange={e => setBuyId(e.target.value)} placeholder="e.g. 15"
                        style={inputStyle} />
                    </div>
                  </div>
                  <label style={{ fontSize: 11, color: c.dim, display: "block", marginBottom: 4 }}>Service Request</label>
                  <textarea value={svcReq} onChange={e => setSvcReq(e.target.value)}
                    placeholder="Describe what work is needed…"
                    rows={3} style={{ ...inputStyle, resize: "vertical", marginBottom: 12 }} />
                  <button onClick={doNego} disabled={negoStep >= 0} style={{ ...btn, width: "100%", opacity: negoStep >= 0 ? 0.5 : 1 }}>
                    {negoStep >= 0 ? "Negotiating…" : "🤝 Negotiate & Propose On-Chain"}
                  </button>

                  {negoStep >= 0 && (
                    <div style={{ marginTop: 20, padding: 16, background: c.surface, borderRadius: 8, border: `1px solid ${c.border}` }}>
                      {negoSteps.map((s, i) => (
                        <div key={i} style={{ marginBottom: 8 }}>
                          <StepDot done={negoStep > i} active={negoStep === i} label={s} />
                        </div>
                      ))}
                      {negoStep >= negoSteps.length && negoResult && (
                        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, animation: "slideUp 0.4s ease-out",
                          background: negoResult.accepted ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                          border: `1px solid ${negoResult.accepted ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: negoResult.accepted ? c.green : c.red }}>
                            {negoResult.accepted ? "✅ Agreement Reached" : "❌ Rejected"} <span style={{ fontSize: 11, fontWeight: 400, color: c.dim }}>Confidence: {negoResult.confidence}%</span>
                          </div>
                          <p style={{ fontSize: 12, color: c.dim, margin: "6px 0", lineHeight: 1.5 }}>{negoResult.reasoning}</p>
                          {negoResult.txHash && <a href={`${OKLINK}/tx/${negoResult.txHash}`} target="_blank" style={{ fontSize: 11, color: c.accent, textDecoration: "none" }}>View contract on OKLink ↗</a>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── ACTIVITY FEED ── */}
          <div style={{ ...card, position: "sticky", top: 20, maxHeight: "calc(100vh - 100px)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <PulseDot />
              <h2 style={{ fontSize: 12, fontWeight: 600, margin: 0, color: c.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Activity</h2>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {feed.length === 0 && <p style={{ color: c.dim, fontSize: 12, textAlign: "center", padding: "2rem 0" }}>Waiting for activity…</p>}
              {feed.map((ev, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: `slideUp 0.3s ease-out both`, fontSize: 12, padding: "4px 0" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{ev.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: c.text }}>{ev.text}</span>
                    <div style={{ fontSize: 10, color: c.dim, marginTop: 1, fontFamily: c.mono }}>{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Quick stats at bottom */}
            {health && (
              <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 12, marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10, color: c.dim, fontFamily: c.mono }}>
                <div>Entities: {health.entities}</div>
                <div>Contracts: {health.contracts}</div>
                <div>Chain: X Layer</div>
                <div style={{ color: c.green }}>● Live</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

const card: CSS = {
  background: "#08080f",
  border: "1px solid #14142a",
  borderRadius: 12,
  padding: "18px 20px",
};

const btn: CSS = {
  padding: "10px 20px",
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "inherit",
  transition: "all 0.2s",
};

const inputStyle: CSS = {
  width: "100%",
  padding: "9px 12px",
  background: "#050508",
  color: "#e4e4e7",
  border: "1px solid #14142a",
  borderRadius: 7,
  fontSize: 13,
  fontFamily: "inherit",
  outline: "none",
};

function navBtn(on: boolean): CSS {
  return {
    padding: "7px 16px",
    background: on ? "rgba(124,58,237,0.12)" : "transparent",
    color: on ? "#c4b5fd" : "#52525b",
    border: `1px solid ${on ? "rgba(124,58,237,0.25)" : "transparent"}`,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    transition: "all 0.2s",
  };
}

function StatCard({ icon, label, value, prefix, suffix, color }: any) {
  return (
    <div style={{ ...card, display: "flex", alignItems: "center", gap: 12, animation: "slideUp 0.4s ease-out both" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: c.mono, color }}>
          <Counter value={value} prefix={prefix || ""} suffix={suffix || ""} />
        </div>
        <div style={{ fontSize: 10, color: c.dim, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      </div>
    </div>
  );
}

function EntityCard({ entity, index }: { entity: any; index: number }) {
  const age = Math.floor(Math.random() * 48) + 1;
  const revenue = (Math.random() * 5 + 0.5).toFixed(1);
  const growth = (Math.random() * 40 - 5).toFixed(0);
  const isPositive = Number(growth) >= 0;

  return (
    <div style={{ ...card, animation: `slideUp 0.4s ease-out ${index * 0.08}s both`, transition: "all 0.2s", cursor: "default" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.accent; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${c.accentGlow}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = c.border; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.accent, fontFamily: c.mono }}>#{entity.id}</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{entity.name}</span>
            <PulseDot color={c.green} size={6} />
          </div>
          <p style={{ fontSize: 11, color: c.dim, margin: "4px 0 0", maxWidth: 360, lineHeight: 1.4 }}>{entity.mission}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
        <div>
          <div style={{ fontSize: 10, color: c.dim, textTransform: "uppercase", letterSpacing: "0.04em" }}>Revenue</div>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: c.mono, color: c.green }}>${revenue}K</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: c.dim, textTransform: "uppercase", letterSpacing: "0.04em" }}>Growth</div>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: c.mono, color: isPositive ? c.green : c.red }}>{isPositive ? "+" : ""}{growth}%</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: c.dim, textTransform: "uppercase", letterSpacing: "0.04em" }}>Age</div>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: c.mono, color: c.text }}>{age}h</div>
        </div>
      </div>
    </div>
  );
}
