import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

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

Review the service request and entity constitutions. Decide whether to proceed.

Output ONLY valid JSON:
{
  "accepted": true/false,
  "confidence": 0-100,
  "contractTerms": {
    "providerEntityId": number,
    "buyerEntityId": number,
    "deliverableHash": "keccak256 of deliverable spec (hex)",
    "price": "amount in wei as string",
    "deadline": unixTimestamp
  },
  "reasoning": "brief explanation of why you accepted or rejected"
}

Negotiation rules:
- Price must be fair to both parties
- Deadline must be achievable
- Check if the work violates either entity's constitutional boundaries
- If rejected, explain clearly what needs to change`;

export async function negotiateContract(
  providerConstitution: string,
  buyerConstitution: string,
  serviceRequest: string
): Promise<NegotiationResult> {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
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
