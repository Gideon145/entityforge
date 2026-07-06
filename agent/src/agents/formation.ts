import Anthropic from "@anthropic-ai/sdk";

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

export interface EntityConstitution {
  name: string;
  mission: string;
  laws: string[];         // Constitutional laws (immutable rules)
  members: { address: string; share: number }[];
  decisionModel: "consensus" | "majority" | "dictator";
  profitLogic: string;    // How revenue is generated
  contractBoundaries: {   // What the entity can/cannot do
    allowed: string[];
    forbidden: string[];
  };
  dissolutionTerms: string; // Under what conditions the entity dissolves
}

const FORMATION_PROMPT = `You are the Formation Agent for EntityForge — the protocol that creates Autonomous Economic Entities (AEEs), which are digital LLCs for AI agents.

Your job: take a human's business idea and generate a complete entity constitution.

Output ONLY valid JSON matching this schema, no markdown, no explanation:
{
  "name": "entity name (max 32 chars)",
  "mission": "one-line purpose statement",
  "laws": ["immutable constitutional law 1", "law 2", "law 3", "law 4", "law 5"],
  "members": [{ "address": "0x... (placeholder)", "share": 10000 }],
  "decisionModel": "consensus|majority|dictator",
  "profitLogic": "how this entity generates revenue and distributes it",
  "contractBoundaries": {
    "allowed": ["allowed activity", "allowed activity"],
    "forbidden": ["forbidden activity"]
  },
  "dissolutionTerms": "conditions under which the entity should dissolve"
}

Rules:
- laws MUST be exactly 5 immutable rules
- share is in basis points, must sum to 10000 (100%). For solo founder, share=10000
- decisionModel dictates how the entity votes on contracts
- profitLogic describes the business model clearly
- All fields required. Be creative but practical.`;

export async function formEntity(ideaDescription: string): Promise<EntityConstitution> {
  const msg = await getAnthropic().messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    system: FORMATION_PROMPT,
    messages: [{ role: "user", content: ideaDescription }],
  });

  const text = msg.content
    .filter((block) => block.type === "text")
    .map((block) => (block as Anthropic.TextBlock).text)
    .join("\n");

  // Parse JSON from response (handle possible markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Formation agent returned invalid JSON: ${text.slice(0, 200)}`);

  const constitution: EntityConstitution = JSON.parse(jsonMatch[0]);

  // Validate required fields
  if (!constitution.name || !constitution.mission || !constitution.laws ||
      !constitution.members || !constitution.decisionModel || !constitution.profitLogic ||
      !constitution.contractBoundaries || !constitution.dissolutionTerms) {
    throw new Error("Constitution missing required fields");
  }
  if (constitution.laws.length !== 5) {
    throw new Error("Constitution must have exactly 5 laws");
  }
  if (!["consensus", "majority", "dictator"].includes(constitution.decisionModel)) {
    throw new Error(`Invalid decision model: ${constitution.decisionModel}`);
  }

  return constitution;
}
