"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_AGENT_API || "http://localhost:3001";
const OKLINK = process.env.NEXT_PUBLIC_OKLINK || "https://www.oklink.com/x-layer/evm";

type Tab = "form" | "entities" | "contracts";

const s = {
  main: { maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, sans-serif" } as React.CSSProperties,
  h1: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.1rem" } as React.CSSProperties,
  sub: { color: "#888", fontSize: "0.9rem", marginBottom: "1.5rem" } as React.CSSProperties,
  tabs: { display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" } as React.CSSProperties,
  tab: (on: boolean) => ({ padding: "0.5rem 1.1rem", background: on ? "#1a1a3a" : "#0d0d0d", color: on ? "#c4b5fd" : "#555", border: `1px solid ${on ? "#2d2d5a" : "#191919"}`, borderRadius: 7, cursor: "pointer", fontSize: "0.87rem", fontWeight: 500 } as React.CSSProperties),
  card: { background: "#0d0d0d", border: "1px solid #1a1a2e", borderRadius: 10, padding: "1.25rem", marginBottom: "0.65rem" } as React.CSSProperties,
  input: { width: "100%", padding: "0.75rem 0.9rem", background: "#080808", color: "#e0e0e0", border: "1px solid #1f1f1f", borderRadius: 7, fontSize: "0.9rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" } as React.CSSProperties,
  btn: (busy?: boolean) => ({ padding: "0.55rem 1.5rem", background: busy ? "#131313" : "#1a1a4e", color: busy ? "#555" : "#c4b5fd", border: "1px solid #2d2d5a", borderRadius: 7, cursor: busy ? "not-allowed" : "pointer", fontSize: "0.9rem", fontWeight: 500, marginTop: "0.6rem" } as React.CSSProperties),
  badge: { display: "inline-block", padding: "0.15rem 0.55rem", borderRadius: 4, background: "#0d2e1a", color: "#4ade80", fontSize: "0.7rem", fontWeight: 600 },
  tag: (bg: string) => ({ display: "inline-block", padding: "0.12rem 0.5rem", borderRadius: 4, background: bg, color: "#fff", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.03em" } as React.CSSProperties),
  link: { color: "#8b8bff", textDecoration: "none", fontSize: "0.8rem" },
  h2: { fontSize: "1.05rem", fontWeight: 600, marginTop: 0 } as React.CSSProperties,
  label: { color: "#777", fontSize: "0.8rem", marginBottom: "0.2rem", display: "block" } as React.CSSProperties,
};

function okLink(hash: string) { return `${OKLINK}/tx/${hash}`; }

export default function Home() {
  const [tab, setTab] = useState<Tab>("form");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [entities, setEntities] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);

  // negotiate
  const [prov, setProv] = useState(""); const [buy, setBuy] = useState("");
  const [svc, setSvc] = useState(""); const [nego, setNego] = useState<any>(null);
  const [negoBusy, setNegoBusy] = useState(false);
  const [valMsg, setValMsg] = useState("");

  useEffect(() => {
    fetch(`${API}/health`).then(r => r.json()).then(setHealth).catch(() => {});
    fetch(`${API}/entities`).then(r => r.json()).then(setEntities).catch(() => {});
    fetch(`${API}/contracts`).then(r => r.json()).then(setContracts).catch(() => {});
  }, []);

  async function doForm() {
    if (!idea.trim()) return; setLoading(true); setResult(null);
    try {
      const r = await fetch(`${API}/form`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea }) });
      const d = await r.json(); setResult(d);
      if (d.success) { fetch(`${API}/entities`).then(r => r.json()).then(setEntities); }
    } catch (e: any) { setResult({ error: e.message }); }
    setLoading(false);
  }

  async function doNego() {
    setValMsg("");
    if (!prov.trim() || !buy.trim() || !svc.trim()) {
      setValMsg("Please fill in all three fields: Provider ID, Buyer ID, and Service Request.");
      return;
    }
    if (isNaN(+prov) || isNaN(+buy)) {
      setValMsg("Provider ID and Buyer ID must be numbers.");
      return;
    }
    setNegoBusy(true); setNego(null);
    try {
      const r = await fetch(`${API}/negotiate`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId: +prov, buyerId: +buy, serviceRequest: svc }) });
      const d = await r.json(); setNego(d);
      if (d.accepted) { fetch(`${API}/contracts`).then(r => r.json()).then(setContracts); }
    } catch (e: any) { setNego({ error: e.message }); }
    setNegoBusy(false);
  }

  async function refresh(t: Tab) { setTab(t); if (t === "entities") { fetch(`${API}/entities`).then(r => r.json()).then(setEntities); } if (t === "contracts") { fetch(`${API}/contracts`).then(r => r.json()).then(setContracts); } }

  return (
    <main style={s.main}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={s.h1}>🏛️ EntityForge</h1>
          <p style={s.sub}>Autonomous Economic Entities — the LLC for AI agents, on X Layer</p>
        </div>
        {health && (
          <div style={{ ...s.card, padding: "0.5rem 1rem", display: "flex", gap: "1.2rem", fontSize: "0.82rem", background: "#0e0e18" }}>
            <span>🏛️ {health.entities} entities</span><span>📜 {health.contracts} contracts</span><span style={{ color: "#4ade80" }}>● X Layer mainnet</span>
          </div>
        )}
      </div>

      <div style={s.tabs}>
        {(["form", "entities", "contracts"] as Tab[]).map(t => (
          <button key={t} style={s.tab(tab === t)} onClick={() => refresh(t)}>
            {t === "form" ? "🏛️ Form" : t === "entities" ? "📋 Entities" : "📜 Contracts"}
          </button>
        ))}
      </div>

      {tab === "form" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div>
            <div style={s.card}>
              <h2 style={s.h2}>Create Entity</h2>
              <p style={{ color: "#777", fontSize: "0.8rem", marginBottom: "0.8rem" }}>
                Claude generates a constitution, then it&apos;s forged on-chain on X Layer mainnet.
              </p>
              <textarea value={idea} onChange={e => setIdea(e.target.value)}
                placeholder="Describe your AI business idea…"
                rows={4} style={s.input} />
              <button onClick={doForm} disabled={loading} style={s.btn(loading)}>
                {loading ? "⚡ Forging on X Layer…" : "🏛️ Form Entity"}
              </button>
            </div>

            <div style={s.card}>
              <h2 style={s.h2}>🤝 Negotiate</h2>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Provider Entity ID</label>
                  <input type="number" value={prov} onChange={e => setProv(e.target.value)} placeholder="e.g. 12" style={{ ...s.input, padding: "0.4rem 0.6rem" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Buyer Entity ID</label>
                  <input type="number" value={buy} onChange={e => setBuy(e.target.value)} placeholder="e.g. 13" style={{ ...s.input, padding: "0.4rem 0.6rem" }} />
                </div>
              </div>
              <label style={s.label}>Service Request</label>
              <textarea value={svc} onChange={e => setSvc(e.target.value)}
                placeholder="What work does the buyer need from the provider?"
                rows={3} style={{ ...s.input, marginBottom: "0.3rem" }} />
              <button onClick={doNego} disabled={negoBusy} style={s.btn(negoBusy)}>
                {negoBusy ? "⚡ Negotiating…" : "🤝 Negotiate & Propose On-Chain"}
              </button>
              {valMsg && (
                <p style={{ color: "#fbbf24", fontSize: "0.8rem", margin: "0.4rem 0 0" }}>⚠️ {valMsg}</p>
              )}
              {nego && (
                <div style={{ marginTop: "0.8rem", padding: "0.7rem", borderRadius: 7, background: nego.accepted ? "#061a06" : "#1a0606", border: `1px solid ${nego.accepted ? "#0d3320" : "#331010"}`, maxHeight: 280, overflowY: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                    <strong style={{ color: nego.accepted ? "#4ade80" : "#f87171", fontSize: "0.95rem" }}>{nego.accepted ? "✅ Accepted" : "❌ Rejected"}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>Confidence: {nego.confidence}%</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", margin: "0.3rem 0", color: "#bbb", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{nego.reasoning}</p>
                  {nego.txHash && <a href={okLink(nego.txHash)} target="_blank" style={s.link}>View tx on OKLink ↗</a>}
                  {nego.contractId && <p style={{ fontSize: "0.7rem", color: "#666", marginTop: "0.3rem" }}>Contract ID: {nego.contractId}</p>}
                </div>
              )}
            </div>
          </div>

          <div>
            {result && (result.error
              ? <div style={{ ...s.card, border: "1px solid #331010" }}><p style={{ color: "#f87171", margin: 0 }}>❌ {result.error}</p></div>
              : <div style={s.card}>
                  <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span style={s.badge}>ENTITY #{result.entityId}</span>
                    <span style={s.badge}>{result.constitution.decisionModel}</span>
                  </div>
                  <h2 style={{ ...s.h2, marginBottom: "0.15rem" }}>{result.constitution.name}</h2>
                  <p style={{ color: "#999", fontSize: "0.85rem", marginTop: 0 }}>{result.constitution.mission}</p>
                  <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "0.75rem" }}><strong>Revenue:</strong> {result.constitution.profitLogic}</p>

                  <h3 style={{ fontSize: "0.85rem", marginBottom: "0.25rem", color: "#ccc" }}>Constitutional Laws</h3>
                  <ol style={{ paddingLeft: "1.1rem", fontSize: "0.78rem", color: "#aaa", marginTop: 0 }}>
                    {result.constitution.laws.map((law: string, i: number) => <li key={i} style={{ marginBottom: "0.15rem" }}>{law}</li>)}
                  </ol>

                  <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                    {result.constitution.contractBoundaries.allowed.map((a: string, i: number) => <span key={i} style={s.tag("#0d3320")}>✅ {a}</span>)}
                    {result.constitution.contractBoundaries.forbidden.map((f: string, i: number) => <span key={i} style={s.tag("#331010")}>🚫 {f}</span>)}
                  </div>

                  <p style={{ fontSize: "0.7rem", color: "#555", marginTop: "0.6rem", marginBottom: "0.25rem" }}>
                    Dissolution: {result.constitution.dissolutionTerms}
                  </p>
                  <a href={okLink(result.txHash)} target="_blank" style={s.link}>View tx on OKLink ↗</a>
                </div>
            )}
          </div>
        </div>
      )}

      {tab === "entities" && (
        <div>
          {entities.length === 0 && <p style={{ color: "#555" }}>No entities yet. Form one from the Form tab.</p>}
          {entities.map(e => (
            <div key={e.id} style={s.card}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={s.badge}>#{e.id}</span>
                <strong style={{ fontSize: "0.95rem" }}>{e.name}</strong>
              </div>
              <p style={{ color: "#777", fontSize: "0.82rem", margin: 0 }}>{e.mission}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "contracts" && (
        <div>
          {contracts.length === 0 && <p style={{ color: "#555" }}>No contracts yet. Negotiate one from the Form tab.</p>}
          {contracts.map((c: any, i: number) => (
            <div key={i} style={s.card}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                <span style={s.badge}>CONTRACT #{c.id}</span>
                <span style={s.tag(c.status === "proposed" ? "#1a1a4e" : "#0d3320")}>{c.status.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: "0.82rem", margin: "0.2rem 0", color: "#999" }}>
                Provider #{c.providerEntityId} → Buyer #{c.buyerEntityId}
              </p>
              {c.txHash && <a href={okLink(c.txHash)} target="_blank" style={s.link}>View tx on OKLink ↗</a>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
