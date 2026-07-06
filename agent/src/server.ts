import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Load .env from agent directory regardless of cwd
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import { formEntity } from "./agents/formation";
import { negotiateContract } from "./agents/negotiation";
import { findProvider } from "./agents/procurement";
import { getProvider, getFactory, getContract } from "./chain";
import { ethers } from "ethers";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// In-memory store (replace with DB in production)
let entities: Array<{
  id: number;
  name: string;
  constitution: any;
  constitutionHash: string;
}> = [];

let activeContracts: any[] = [];

// ── Health ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", entities: entities.length, contracts: activeContracts.length });
});

// ── POST /form — Form a new entity ──────────────────────
app.post("/form", async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea || typeof idea !== "string") {
      return res.status(400).json({ error: "idea (string) required" });
    }

    // 1. AI generates constitution
    const constitution = await formEntity(idea);

    // 2. Hash the constitution for on-chain storage
    const constitutionHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify(constitution))
    );

    // 3. Store in memory
    const entityId = entities.length + 1;
    entities.push({
      id: entityId,
      name: constitution.name,
      constitution,
      constitutionHash,
    });

    // 4. Log — in production, call factory.formEntity() on-chain
    console.log(`🏛️ Entity #${entityId} formed: ${constitution.name}`);

    res.json({
      success: true,
      entityId,
      constitution,
      constitutionHash,
    });
  } catch (err: any) {
    console.error("Formation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /entities — List all entities ───────────────────
app.get("/entities", (_req, res) => {
  const summary = entities.map((e) => ({
    id: e.id,
    name: e.name,
    mission: e.constitution.mission,
    status: "active",
  }));
  res.json(summary);
});

// ── GET /entities/:id — Entity detail ───────────────────
app.get("/entities/:id", (req, res) => {
  const entity = entities.find((e) => e.id === parseInt(req.params.id));
  if (!entity) return res.status(404).json({ error: "Entity not found" });
  res.json(entity);
});

// ── POST /procure — Find provider for a task ────────────
app.post("/procure", async (req, res) => {
  try {
    const { entityId, serviceNeeded } = req.body;
    if (!entityId || !serviceNeeded) {
      return res.status(400).json({ error: "entityId and serviceNeeded required" });
    }

    const requestor = entities.find((e) => e.id === entityId);
    if (!requestor) return res.status(404).json({ error: "Requestor entity not found" });

    const available = entities
      .filter((e) => e.id !== entityId)
      .map((e) => ({
        id: e.id,
        name: e.name,
        constitutionSummary: `Mission: ${e.constitution.mission}. Allowed: ${e.constitution.contractBoundaries.allowed.join(", ")}. Forbidden: ${e.constitution.contractBoundaries.forbidden.join(", ")}`,
      }));

    const result = await findProvider(
      JSON.stringify(requestor.constitution),
      serviceNeeded,
      available
    );

    res.json(result);
  } catch (err: any) {
    console.error("Procurement error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /negotiate — Negotiate contract terms ──────────
app.post("/negotiate", async (req, res) => {
  try {
    const { providerId, buyerId, serviceRequest } = req.body;
    if (!providerId || !buyerId || !serviceRequest) {
      return res.status(400).json({ error: "providerId, buyerId, serviceRequest required" });
    }

    const provider = entities.find((e) => e.id === providerId);
    const buyer = entities.find((e) => e.id === buyerId);
    if (!provider) return res.status(404).json({ error: "Provider not found" });
    if (!buyer) return res.status(404).json({ error: "Buyer not found" });

    const result = await negotiateContract(
      JSON.stringify(provider.constitution),
      JSON.stringify(buyer.constitution),
      serviceRequest
    );

    // If accepted, record contract
    if (result.accepted) {
      const contract = {
        id: activeContracts.length + 1,
        ...result.contractTerms,
        status: "proposed",
        createdAt: new Date().toISOString(),
      };
      activeContracts.push(contract);
    }

    res.json(result);
  } catch (err: any) {
    console.error("Negotiation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /contracts — List all contracts ─────────────────
app.get("/contracts", (_req, res) => {
  res.json(activeContracts);
});

// ── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🏛️  EntityForge Agent running on http://localhost:${PORT}`);
  console.log("   Formation Agent  — POST /form");
  console.log("   Negotiation Agent — POST /negotiate");
  console.log("   Procurement Agent — POST /procure");
});
