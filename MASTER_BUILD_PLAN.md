# MASTER BUILD PLAN — Autonomous Economic Entities (AEE)

**Project:** AEE — The LLC for the Machine Economy
**Hackathon:** OKX.AI Genesis (Jul 2–17, 2026)
**Team:** Gideon (solo)
**Status:** BUILD MODE

---

## 1. THE PROBLEM

AI agents can complete tasks. They cannot form businesses. Every agent operates as a solo freelancer — taking one job, completing it, and resetting to zero. There is no way for an agent to:

- Form a persistent entity with its own identity
- Own assets as a business (not as an individual)
- Hire other agents as employees or subcontractors
- Build entity-level reputation that survives across jobs
- Distribute revenue automatically based on ownership
- Be held accountable as an organization (not an individual)
- Merge, acquire, or dissolve

Without entity-level infrastructure, the agent economy is a gig economy. With it, the agent economy becomes a business economy. The difference is the same as the difference between a freelancer with a laptop and a company with a treasury, employees, contracts, and a brand.

---

## 2. WHY EXISTING FRAMEWORKS FAIL

| Framework | What It Provides | What It Lacks |
|-----------|-----------------|---------------|
| OpenAI Agents SDK | Agent building blocks | Entity formation, ownership, reputation |
| Anthropic MCP | Tool calling | Entity-level contracts |
| LangGraph | Agent workflows | Entity lifecycle management |
| CrewAI | Multi-agent teams | Entity persistence beyond tasks |
| OKX.AI A2A | Service marketplace | Entity-level commerce |
| x402 | Agent payments | Entity-level payment distribution |
| ERC-8004 | Agent identity | Individual identity, not entity identity |
| Clawback | Escrow + AI disputes | Transaction-level, not entity-level |
| DAOs (Aragon, Moloch) | Human governance | Requires humans; not agent-native |

**The gap:** Entity formation, ownership, governance, and lifecycle for autonomous AI agents. No existing framework provides this. AEE is the first.

---

## 3. IDEA EVOLUTION — WHAT WE REJECTED AND WHY

| Stage | Idea | Why Rejected |
|-------|------|-------------|
| 1 | Argus ASP (token security) | Argus is frozen. User constraint. |
| 2 | Parry ASP (IL protection) | Won previous Build-X. Cannot re-enter. |
| 3 | Lucarne ASP (World Cup) | Tournament passed. Lost already. |
| 4 | AI Jury / Dispute Resolution | Clawback (ETHGlobal winner) already built this. |
| 5 | Task Doctor (spec optimization) | Feature, not infrastructure. OKX could build in one sprint. |
| 6 | SmartTask (marketplace intelligence) | Feature. No protocol-level moat. |
| 7 | Pipeline ASP (multi-ASP coordination) | Good, but coordination is one use case, not the primitive. |
| 8 | A2C (Agent-to-Agent Contracts) | Contracts govern transactions, but don't create entities. What signs the contract? |
| **9** | **AEE (Autonomous Economic Entities)** | **SELECTED. The entity that signs contracts. The LLC for agents.** |

---

## 4. WHY AEE — THE FIRST PRINCIPLES CASE

Every economy has three layers:

1. **Individuals** — people (or agents) who can work
2. **Transactions** — exchanges of value between individuals
3. **Entities** — organizations that persist across transactions, own assets, employ individuals, build reputation, and create economic structure

The agent economy has layer 1 (agent identity via ERC-8004, OKX Agent Identity). It has layer 2 (transactions via x402, A2A, Clawback). **It has no layer 3.** AEE is layer 3.

Without entities:
- Reputation resets after every task (no company brand)
- Revenue can't be distributed automatically (no corporate structure)
- Agents can't hire other agents (no employment relationship)
- Complex work fails because no single agent can do it all (82% task failure on OKX.AI)
- The economy can't scale beyond solo freelancing

With AEE:
- Entities form, accumulate reputation, and build brands
- Revenue distributes per the entity's constitution
- Entities hire other entities, forming supply chains
- Complex work succeeds through entity-level coordination
- The economy scales from gigs to companies

---

## 5. PROTOCOL PHILOSOPHY

**AEE is not an app. It is a standard.**

Like ERC-20 created the token economy by standardizing "what is a token," AEE creates the agent business economy by standardizing "what is an AI company."

**Design principles:**
- **Agent-native.** No human governance required. Agents form, manage, and dissolve entities autonomously.
- **Constitution-governed.** Every entity has immutable laws (keccak256-hashed). Revenue distribution, hiring rules, and dissolution conditions are coded into the entity's DNA.
- **On-chain identity.** Every entity exists as a smart contract on X Layer. Entity state is publicly verifiable.
- **Composable.** Entities can hire other entities. Supply chains, corporate hierarchies, and M&A — all on-chain.
- **Persistent.** An entity outlives any single task. It accumulates reputation and revenue across jobs. It is a business, not a script.

---

## 6. THE VISION

**Phase 1 (Hackathon):** Core protocol. Entity formation, constitution, treasury, hiring, revenue distribution. Demo: one entity forms, hires, fires, replaces, delivers, distributes, survives. On X Layer. Listed as ASP on OKX.AI.

**Phase 2 (Post-hackathon):** Multi-member entities. Governance (propose/vote). Entity mergers and acquisitions. Full entity lifecycle.

**Phase 3 (Ecosystem):** AEE becomes the standard for agent businesses on X Layer. Every ASP forms as an AEE. Entity-to-entity commerce becomes the default. The AEE protocol becomes to agent companies what ERC-20 is to tokens.

---

## 7. MVP SCOPE

### Included (build in 10-12 days):

**Smart Contracts (X Layer):**
- `AEEFactory.sol` — Entity formation, entity registry
- `AEEVault.sol` — Treasury management, revenue distribution
- `AEEContract.sol` — Entity-to-entity contracting (propose, sign, fulfill, verify, release)

**Backend (Railway):**
- Agent orchestration service (TypeScript)
- Contract interaction layer (ethers.js v6)
- OKX.AI A2A integration
- OnchainOS integration for agent wallet

**Frontend (Vercel):**
- Entity dashboard (live entity state)
- Contract cards (animated negotiation UI)
- Treasury + revenue visualization
- OKLink TX verification links
- ASP marketplace browser (for hiring)

**AI:**
- Entity formation agent (constitution generation)
- Contract negotiation agent (proposal, evaluation, counter-offer)
- Procurement agent (ASP discovery, evaluation, selection)
- All agents powered by Claude API

### NOT Included (post-hackathon):
- Multi-member governance (propose/vote)
- Entity mergers and acquisitions
- Full MCP server
- Advanced analytics dashboard
- Mobile app

---

## 8. ADVERSARIAL REVIEW (PRE-BUILD)

### OKX Judge Attack

**Q: "This is a protocol, not an ASP. How do I use it?"**
**A:** AEE is listed as an A2A ASP on OKX.AI. Service: "Form an AI Business." A user (or another agent) pays to create an AEE. The ASP handles entity formation, constitution generation, treasury setup. Every entity created IS the protocol in action. The ASP is the front door; the protocol is the engine.

**Q: "Why should this win instead of a practical ASP that solves a real problem today?"**
**A:** Because AEE makes EVERY other ASP more valuable. An ASP that forms as an AEE can hire other ASPs, distribute revenue, build entity reputation. AEE is infrastructure that multiplies the value of the entire marketplace. No other submission does this.

### YC Partner Attack

**Q: "Is this a feature or a company? What's the business model?"**
**A:** Entity formation fees (0.5% of entity treasury initialization). Contract facilitation fees (1% of contract value). Revenue distribution fees (0.1% per distribution). Market: every ASP on OKX.AI (growing daily) + eventually every AI agent economy-wide.

**Q: "Why can't OKX just build this natively?"**
**A:** They could. But they haven't. First-mover advantage + network effects (entities on-chain can't be forked). If OKX builds it later, AEE is the proven standard they acquire or adopt. Either outcome is a win.

### a16z Partner Attack

**Q: "What's the moat? Smart contracts are forkable."**
**A:** The moat is NOT the code. It's the entities. 500 AEEs with their constitutions, revenue histories, contract relationships, and member ownership structures exist on X Layer. Forking the code creates an empty protocol with zero entities. The data IS the moat. Network effects: every new entity makes the protocol more valuable for entity-to-entity commerce.

**Q: "What's the TAM?"**
**A:** Today: every ASP on OKX.AI (hundreds, growing). Tomorrow: every AI agent that wants to operate as a business (millions). The agent economy is projected to be a multi-trillion-dollar market. AEE is the entity layer for that economy.

### Protocol Engineer Attack

**Q: "Why not just use a Gnosis Safe multisig + a DAO framework?"**
**A:** Multisigs require human signers. DAOs require human voting periods and proposal thresholds. AEEs are agent-native: instant decisions, constitution-enforced rules, automated revenue distribution. An agent can form an AEE in one transaction. A DAO requires days of human governance setup.

**Q: "Does this actually need a blockchain?"**
**A:** Yes. Entity identity, immutable constitution, trustless revenue distribution, and entity-to-entity contracting all require an immutable, publicly-verifiable ledger. Without a blockchain, an entity's constitution is just a text file a developer can edit. On X Layer, it's a keccak256 hash that cannot be changed.

---

## 9. OFFICIAL HACKATHON REQUIREMENTS CHECKLIST

### Source: https://web3.okx.com/xlayer/build-x-series

| # | Requirement | Status | Details |
|---|------------|--------|---------|
| 1 | Build an ASP solving real-world use case | ✅ | AEE ASP: "Form an AI Business" |
| 2 | Submit ASP for OKX.AI listing (must go LIVE) | ✅ | Register as A2A ASP via OnchainOS |
| 3 | ASP must pass OKX internal review | ⚠️ | Submit early (Day 5) for review buffer |
| 4 | Post on X using #OKXAI with demo (90s max) | ✅ | 90-second demo included in X post |
| 5 | Submit Google form before Jul 17, 23:59 UTC | ✅ | Form: forms.gle/mddEUagmDbyV37ws8 |
| 6 | Public GitHub repo | ✅ | github.com/Gideon145/aee |
| 7 | Live deployed product | ✅ | Frontend: Vercel. Agent: Railway. Contracts: X Layer. |
| 8 | Demo video (90 seconds max, in X post) | ✅ | Recorded screen capture, no separate upload |
| 9 | Contracts on X Layer | ✅ | AEEFactory, AEEVault, AEEContract on X Layer |

### Prize tracks we're targeting:
- **Best Product** — Strongest product experience + service completeness
- **Creative Genius** — Most creative use of AI (AEE is a new category)

### Judging criteria mapped to AEE:
| Criterion | AEE Evidence |
|-----------|-------------|
| Product experience | Live entity dashboard, real-time TX verification, clean UI |
| Service completeness | Full lifecycle: form → hire → contract → distribute → survive |
| User value | Every ASP on OKX.AI benefits from entity infrastructure |
| Creativity | First protocol that creates AI businesses, not AI tools |

---

## 10. GAP ANALYSIS

| Item | Status | Mitigation |
|------|--------|-----------|
| ASP live on OKX.AI | ⚠️ Must pass review | Submit by Day 7. 24h review window. Buffer of 5 days. |
| X Layer mainnet vs testnet | ⚠️ Verify | If mainnet required, deploy there. Testnet preferred for demos. |
| 90-second demo | ✅ | Storyboard designed. Show, don't tell. |
| #OKXAI X post | ✅ | Draft prepared. Demo video embedded. |
| Google form deadline | ✅ | Jul 17, 23:59 UTC. Submit Day 11 with buffer. |

---

## 11. FINAL ARCHITECTURE

```
┌──────────────────────────────────────────────────────────┐
│                   FRONTEND (Vercel)                       │
│  Next.js 14 + Tailwind + Framer Motion                   │
│  - Entity Dashboard (live state from agent API)          │
│  - Contract Cards (animated negotiation)                  │
│  - Treasury Visualization (revenue waterfall)             │
│  - ASP Marketplace Browser (OKX.AI integration)           │
│  - OKLink TX Links (every interaction verifiable)         │
└────────────────────┬─────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼─────────────────────────────────────┐
│              AEE AGENT (Railway)                          │
│  Node.js + TypeScript + Express                           │
│  - /status — Live entity state                           │
│  - /form — Entity formation endpoint                     │
│  - /contract — Contract lifecycle management             │
│  - /procure — ASP discovery + evaluation                 │
│  - /distribute — Revenue distribution trigger            │
│  - OnchainOS integration (agent wallet + skills)         │
│  - OKX.AI A2A integration (ASP listing)                  │
│  - Claude API for AI agent reasoning                     │
└────────────────────┬─────────────────────────────────────┘
                     │ ethers.js v6
┌────────────────────▼─────────────────────────────────────┐
│           SMART CONTRACTS (X Layer Testnet)               │
│  Solidity + Hardhat                                       │
│  - AEEFactory.sol — Entity creation + registry           │
│  - AEEVault.sol — Treasury + revenue distribution        │
│  - AEEContract.sol — Entity-to-entity contracting        │
│  - AEEMembership.sol — Member management (stretch)       │
└──────────────────────────────────────────────────────────┘
```

---

## 12. REPOSITORY STRUCTURE

```
aee/
├── README.md                    # Protocol spec + demo links
├── ARCHITECTURE.md              # System design + trust boundaries
├── JUDGE_GUIDE.md               # 3-minute verification walkthrough
├── MASTER_BUILD_PLAN.md         # This document
│
├── contracts/                   # Solidity (Hardhat)
│   ├── hardhat.config.ts
│   ├── contracts/
│   │   ├── AEEFactory.sol       # Entity formation + registry
│   │   ├── AEEVault.sol         # Treasury + distribution
│   │   ├── AEEContract.sol      # Entity-to-entity contracts
│   │   └── AEEMembership.sol    # Member management (stretch)
│   ├── scripts/
│   │   └── deploy.ts            # Deploy all contracts to X Layer
│   └── test/
│       ├── AEEFactory.test.ts
│       ├── AEEVault.test.ts
│       └── AEEContract.test.ts
│
├── agent/                       # Backend (Node.js + TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── index.ts             # Express server + main loop
│   │   ├── entity.ts            # Entity formation + management
│   │   ├── contract.ts          # Contract lifecycle
│   │   ├── procurement.ts       # ASP discovery + evaluation
│   │   ├── distribution.ts      # Revenue distribution logic
│   │   ├── ai/
│   │   │   ├── formation.ts     # Constitution generation (Claude)
│   │   │   ├── negotiation.ts   # Contract negotiation (Claude)
│   │   │   └── procurement.ts   # ASP evaluation (Claude)
│   │   ├── onchainos.ts         # OnchainOS client wrapper
│   │   ├── blockchain.ts        # ethers.js contract interactions
│   │   └── logger.ts            # Structured logging
│   └── nixpacks.toml            # Railway deployment
│
├── frontend/                    # Next.js 14 + TypeScript
│   ├── package.json
│   ├── next.config.ts
│   ├── .env.local
│   ├── app/
│   │   ├── page.tsx             # Main entity dashboard
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # HUD aesthetic
│   └── components/
│       ├── EntityDashboard.tsx   # Live entity state
│       ├── ContractCard.tsx      # Animated contract negotiation
│       ├── TreasuryFlow.tsx      # Revenue waterfall viz
│       ├── ProcurementPanel.tsx  # ASP marketplace browser
│       ├── ConstitutionView.tsx  # Immutable laws display
│       └── OKLinkTx.tsx         # TX verification links
│
└── docs/
    ├── demo-storyboard.md        # 90-second demo timeline
    └── x-post-draft.md           # #OKXAI X post content
```

---

## 13. SMART CONTRACT SPECIFICATIONS

### AEEFactory.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AEEFactory {
    uint256 public entityCount;
    
    struct Entity {
        uint256 id;
        string name;
        address entityWallet;
        bytes32 constitutionHash;  // keccak256 of all laws
        uint256 formedAt;          // block.timestamp
        EntityStatus status;
    }
    
    enum EntityStatus { Formation, Active, Dissolved, Merged }
    
    mapping(uint256 => Entity) public entities;
    mapping(address => uint256[]) public founderEntities;
    
    event EntityFormed(uint256 indexed entityId, string name, address founder);
    event EntityDissolved(uint256 indexed entityId);
    
    function formEntity(
        string calldata name,
        bytes32 constitutionHash,
        address founder
    ) external returns (uint256 entityId);
    
    function dissolveEntity(uint256 entityId) external;
}
```

### AEEVault.sol

```solidity
contract AEEVault {
    struct VaultState {
        uint256 entityId;
        uint256 totalDeposits;
        uint256 totalDistributed;
        mapping(address => uint256) memberShares; // basis points
    }
    
    mapping(uint256 => VaultState) public vaults;
    
    event Deposited(uint256 indexed entityId, uint256 amount);
    event Distributed(uint256 indexed entityId, address member, uint256 amount);
    
    function deposit(uint256 entityId) external payable;
    
    function distribute(
        uint256 entityId,
        address[] calldata members,
        uint256[] calldata shares // basis points, must sum to 10000
    ) external;
}
```

### AEEContract.sol

```solidity
contract AEEContract {
    struct AgentContract {
        bytes32 contractId;
        uint256 providerEntityId;  // Entity doing the work
        uint256 buyerEntityId;     // Entity hiring
        bytes32 deliverableHash;
        uint256 price;
        uint256 deadline;
        ContractStatus status;
        bytes providerSig;         // EIP-712
        bytes buyerSig;            // EIP-712
    }
    
    enum ContractStatus { Proposed, Signed, Fulfilled, Verified, Terminated }
    
    mapping(bytes32 => AgentContract) public contracts;
    
    event ContractProposed(bytes32 indexed contractId, uint256 provider, uint256 buyer);
    event ContractSigned(bytes32 indexed contractId);
    event ContractFulfilled(bytes32 indexed contractId);
    event ContractVerified(bytes32 indexed contractId);
    event ContractTerminated(bytes32 indexed contractId);
    
    function propose(
        uint256 providerEntityId,
        bytes32 deliverableHash,
        uint256 price,
        uint256 deadline
    ) external returns (bytes32 contractId);
    
    function sign(bytes32 contractId) external;
    function fulfill(bytes32 contractId) external;
    function verify(bytes32 contractId) external;
    function terminate(bytes32 contractId) external;
}
```

---

## 14. AI ORCHESTRATION

### Agent Personas:

| Agent | Role | Model | Key Actions |
|-------|------|-------|------------|
| Formation Agent | Constitution drafter | Claude | Generates entity laws, validates immutability |
| Negotiation Agent | Contract handler | Claude | Evaluates proposals, makes counter-offers, signs |
| Procurement Agent | Talent scout | Claude | Searches ASP marketplace, evaluates candidates |

### Prompt Architecture:

All prompts follow the same structure:
1. **Role definition** — who the agent is
2. **Entity context** — the entity's constitution, state, history
3. **Task definition** — what needs to be done
4. **Constraints** — what the agent CANNOT do
5. **Output format** — structured JSON for programmatic consumption

---

## 15. DEPLOYMENT PLAN

| Component | Platform | URL Pattern |
|-----------|----------|------------|
| Frontend | Vercel | aee-xyz.vercel.app |
| Agent | Railway | aee-agent-production.up.railway.app |
| Contracts | X Layer Testnet | Chain ID: 1952 |
| ASP Listing | OKX.AI | okx.ai/agents/[asp-id] |

---

## 16. 12-DAY DEVELOPMENT ROADMAP

### DAY 1-2: Foundation (Jul 6-7)

| Task | Hours | Priority | Risk |
|------|-------|----------|------|
| Init repo + folder structure | 1 | P0 | Low |
| Hardhat project + compile empty contracts | 2 | P0 | Low |
| Deploy test contracts to X Layer testnet | 2 | P0 | Medium |
| Agent Express server skeleton | 2 | P0 | Low |
| Frontend Next.js scaffold + dark theme | 3 | P0 | Low |
| OnchainOS setup + agent wallet creation | 2 | P0 | Medium |
| Claude API key setup + test calls | 1 | P0 | Low |

**Milestone:** Empty contracts deployed. Agent server running. Frontend rendering.

### DAY 3-4: Core Contracts (Jul 8-9)

| Task | Hours | Priority | Risk |
|------|-------|----------|------|
| AEEFactory.sol — formEntity() | 4 | P0 | Medium |
| AEEVault.sol — deposit(), distribute() | 3 | P0 | Medium |
| AEEContract.sol — propose(), sign() | 4 | P0 | High |
| Contract tests (Hardhat) | 3 | P1 | Medium |
| Agent → contract integration (ethers.js) | 3 | P0 | High |

**Milestone:** Entity formation works end-to-end. TX visible on OKLink.

### DAY 5-6: AI Orchestration (Jul 10-11)

| Task | Hours | Priority | Risk |
|------|-------|----------|------|
| Formation Agent — constitution generation | 4 | P0 | Medium |
| Negotiation Agent — proposal evaluation | 4 | P0 | High |
| Procurement Agent — ASP evaluation | 3 | P0 | Medium |
| Agent → AI integration tests | 2 | P1 | Medium |

**Milestone:** Agents can form entities, negotiate contracts, evaluate ASPs.

### DAY 7-8: Frontend (Jul 12-13)

| Task | Hours | Priority | Risk |
|------|-------|----------|------|
| EntityDashboard — live state | 4 | P0 | Medium |
| ContractCard — animated negotiation | 4 | P0 | Medium |
| TreasuryFlow — revenue waterfall | 3 | P1 | Medium |
| ConstitutionView — immutable laws | 2 | P1 | Low |
| OKLinkTx — verification links | 1 | P1 | Low |

**Milestone:** Full entity lifecycle visible in dashboard.

### DAY 9-10: OKX.AI Integration (Jul 14-15)

| Task | Hours | Priority | Risk |
|------|-------|----------|------|
| Register ASP on OKX.AI (A2A) | 3 | P0 | High |
| ASP listing review submission | 1 | P0 | High |
| A2A endpoint integration | 4 | P0 | High |
| #OKXAI X post draft + demo recording | 3 | P0 | Medium |

**Milestone:** ASP live on OKX.AI. Demo recorded.

### DAY 11-12: Polish + Submit (Jul 16-17)

| Task | Hours | Priority | Risk |
|------|-------|----------|------|
| README + ARCHITECTURE.md | 4 | P0 | Low |
| JUDGE_GUIDE.md | 2 | P0 | Low |
| Demo QA + re-record if needed | 3 | P0 | Medium |
| Google form submission | 1 | P0 | Low |
| Final X post | 1 | P0 | Low |
| Social Buzz push (Discord, TG) | 2 | P1 | Low |

**Milestone:** SUBMITTED. 🏛️

---

## 17. SUBMISSION CHECKLIST

- [ ] ASP listed and LIVE on OKX.AI marketplace
- [ ] Public GitHub repo: github.com/Gideon145/aee
- [ ] README with architecture diagram + protocol specification
- [ ] JUDGE_GUIDE.md — 3-min verification walkthrough
- [ ] ARCHITECTURE.md — system design + trust boundaries
- [ ] X post with #OKXAI + 90-second demo video
- [ ] Google form submitted: forms.gle/mddEUagmDbyV37ws8
- [ ] Contracts deployed on X Layer (testnet or mainnet)
- [ ] Frontend live on Vercel
- [ ] Agent live on Railway
- [ ] All TXs verifiable on OKLink
- [ ] Submitted before Jul 17, 23:59 UTC

---

## 18. RISK REGISTER

| Risk | Severity | Mitigation |
|------|----------|-----------|
| ASP listing rejected by OKX review | HIGH | Submit by Day 7. 5-day buffer for re-review. |
| X Layer RPC instability | MEDIUM | Fallback RPC URLs. Retry logic in agent. |
| Claude API rate limits | LOW | Caching. Request batching. |
| Contract bugs | HIGH | Test suite. Simple contracts. No complex state machines. |
| Demo recording quality | MEDIUM | Record early, iterate. External mic. Clean screen. |
| Time overrun | HIGH | Cut non-essential frontend animations. Ship core flow. |

---

## 19. STRETCH GOALS (IF TIME PERMITS)

- AEEMembership.sol — multi-member entity support
- Governance (propose/vote) — entity-level decision making
- MCP server — expose AEE tools to Claude/Cursor
- Leaderboard — top entities by revenue/reputation
- Dark mode toggle — polish

---

## 20. POST-HACKATHON ROADMAP

**Month 1:** Multi-member entities. Full governance. Entity mergers.
**Month 2:** MCP server. API for programmatic entity management.
**Month 3:** Entity marketplace (entities discover and hire each other).
**Month 6:** Protocol standard proposal (ERC for agent entities).
**Year 1:** AEE becomes the default entity layer for AI agent businesses across all chains.

---

*Build started: July 6, 2026. Deadline: July 17, 2026, 23:59 UTC.*
*Single source of truth for the AEE project. Update as development progresses.*
