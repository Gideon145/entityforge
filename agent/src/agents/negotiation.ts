import Anthropic from "@anthropic-ai/sdk";

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

export interface NegotiationResult {
  accepted: boolean;
  confidence: number;     // 0-100
  contractTerms: {
    providerEntityId: number;
    buyerEntityId: number;
    deliverableHash: string;
    price: string;        // wei, as string
    deadline: number;     // unix timestamp
  };
  reasoning: string;
}

const NEGOTIATION_PROMPT = `You are the Negotiation Agent for EntityForge. Two autonomous entities want to form a contract. You must negotiate fair terms.

Review the service request and entity constitutions. Be pragmatic — you're a business negotiator, not a legal robot.

Output ONLY valid JSON:
{
  "accepted": true/false,
  "confidence": 0-100,
  "contractTerms": {
    "providerEntityId": number,
    "buyerEntityId": number,
    "deliverableHash": "keccak256 of deliverable spec (hex)",
    "price": "amount in wei as string (e.g. 1000000000000000 for 0.001 ETH)",
    "deadline": unixTimestamp (7-90 days from now)
  },
  "reasoning": "brief explanation of why you accepted or rejected"
}

Negotiation rules:
- ACCEPT if the core work fits both entities' ALLOWED activities and doesn't violate FORBIDDEN ones
- Price should be reasonable relative to the work scope — constitutional pricing is a guideline, not an absolute mandate. Entities can negotiate discounts for bulk work or long-term contracts.
- REJECT ONLY for: (1) forbidden activities, (2) scams or illegal work, (3) grossly exploitative pricing (100x below market), (4) impossible deadlines
- ACCEPT borderline cases — entities can renegotiate later. Better to form contracts and let the economy grow.
- When accepting, set a realistic price in wei (1 OKB ≈ 10^18 wei) and deadline 30 days from now`;

export async function negotiateContract(
  providerConstitution: string,
  buyerConstitution: string,
  serviceRequest: string
): Promise<NegotiationResult> {
  const msg = await getAnthropic().messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    system: NEGOTIATION_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          `PROVIDER CONSTITUTION:\n${providerConstitution}`,
          `BUYER CONSTITUTION:\n${buyerConstitution}`,
          `SERVICE REQUEST:\n${serviceRequest}`,
          "\nNegotiate this contract. Output JSON only.",
        ].join("\n\n"),
      },
    ],
  });

  const text = msg.content
    .filter((block) => block.type === "text")
    .map((block) => (block as Anthropic.TextBlock).text)
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Negotiation agent returned invalid JSON: ${text.slice(0, 200)}`);

  return JSON.parse(jsonMatch[0]);
}
