"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_AGENT_API || "http://localhost:3001";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [entities, setEntities] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [tab, setTab] = useState<"form" | "entities" | "contracts">("form");

  async function handleForm() {
    if (!idea.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    }
    setLoading(false);
  }

  async function loadEntities() {
    try {
      const res = await fetch(`${API}/entities`);
      const data = await res.json();
      setEntities(data);
      setTab("entities");
    } catch (err) {
      console.error(err);
    }
  }

  async function loadContracts() {
    try {
      const res = await fetch(`${API}/contracts`);
      const data = await res.json();
      setContracts(data);
      setTab("contracts");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>🏛️ EntityForge</h1>
      <p style={{ color: "#888", marginBottom: "2rem" }}>
        Autonomous Economic Entities — the LLC for AI agents
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {(["form", "entities", "contracts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "0.5rem 1.5rem",
              background: tab === t ? "#1a1a2e" : "#111",
              color: tab === t ? "#e0e0ff" : "#666",
              border: `1px solid ${tab === t ? "#333" : "#1a1a1a"}`,
              borderRadius: 8,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Form Tab */}
      {tab === "form" && (
        <div>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your entity idea...&#10;&#10;Example: A data analytics entity that scrapes web data, cleans it, and sells market intelligence reports to crypto protocols."
            rows={4}
            style={{
              width: "100%",
              padding: "1rem",
              background: "#111",
              color: "#f0f0f0",
              border: "1px solid #333",
              borderRadius: 8,
              resize: "vertical",
              fontFamily: "inherit",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={handleForm}
            disabled={loading}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 2rem",
              background: loading ? "#222" : "#1a1a4e",
              color: loading ? "#666" : "#e0e0ff",
              border: "1px solid #333",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
            }}
          >
            {loading ? "Forging..." : "🏛️ Form Entity"}
          </button>

          {result && (
            <div style={{ marginTop: "2rem" }}>
              {result.error ? (
                <p style={{ color: "#ff6b6b" }}>Error: {result.error}</p>
              ) : (
                <div
                  style={{
                    background: "#111",
                    border: "1px solid #1a1a4e",
                    borderRadius: 8,
                    padding: "1.5rem",
                  }}
                >
                  <h2 style={{ marginTop: 0 }}>✅ Entity #{result.entityId}: {result.constitution.name}</h2>
                  <p><strong>Mission:</strong> {result.constitution.mission}</p>
                  <p><strong>Decision Model:</strong> {result.constitution.decisionModel}</p>
                  <p><strong>Profit Logic:</strong> {result.constitution.profitLogic}</p>
                  <h3>Constitutional Laws</h3>
                  <ol>
                    {result.constitution.laws.map((law: string, i: number) => (
                      <li key={i}>{law}</li>
                    ))}
                  </ol>
                  <h3>Contract Boundaries</h3>
                  <p>✅ Allowed: {result.constitution.contractBoundaries.allowed.join(", ")}</p>
                  <p>🚫 Forbidden: {result.constitution.contractBoundaries.forbidden.join(", ")}</p>
                  <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "1rem" }}>
                    Constitution Hash: {result.constitutionHash}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Entities Tab */}
      {tab === "entities" && (
        <div>
          <button
            onClick={loadEntities}
            style={{
              padding: "0.5rem 1rem",
              background: "#1a1a2e",
              color: "#e0e0ff",
              border: "1px solid #333",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            🔄 Refresh
          </button>
          {entities.length === 0 && <p style={{ color: "#888" }}>No entities yet. Form one!</p>}
          {entities.map((e) => (
            <div key={e.id} style={{ background: "#111", border: "1px solid #1a1a4e", borderRadius: 8, padding: "1rem", marginBottom: "0.5rem" }}>
              <strong>#{e.id}</strong> {e.name} — <span style={{ color: "#888" }}>{e.mission}</span>
            </div>
          ))}
        </div>
      )}

      {/* Contracts Tab */}
      {tab === "contracts" && (
        <div>
          <button
            onClick={loadContracts}
            style={{
              padding: "0.5rem 1rem",
              background: "#1a1a2e",
              color: "#e0e0ff",
              border: "1px solid #333",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            🔄 Refresh
          </button>
          {contracts.length === 0 && <p style={{ color: "#888" }}>No contracts yet. Entities need to negotiate!</p>}
          {contracts.map((c: any, i: number) => (
            <div key={i} style={{ background: "#111", border: "1px solid #1a1a4e", borderRadius: 8, padding: "1rem", marginBottom: "0.5rem" }}>
              <strong>Contract #{c.id}</strong> — {c.status.toUpperCase()}
              <br />
              Provider: Entity #{c.providerEntityId} → Buyer: Entity #{c.buyerEntityId}
              <br />
              Price: {c.price} wei
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
