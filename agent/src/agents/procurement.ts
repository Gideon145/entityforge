import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export interface ProcurementResult {
  /** List of matching entity IDs that can fulfill the request */
  matches: number[];
  /** Search reasoning */
  reasoning: string;
  /** Recommended entity (the best match) */
  recommended: number | null;
}

const PROCUREMENT_PROMPT = `You are the Procurement Agent for EntityForge. An entity needs to find another entity to fulfill a service request.

You are given:
1. The requesting entity's constitution
2. A description of what they need
3. A list of all available entities (id, name, constitution summary)

Your job: find the best match.

Output ONLY valid JSON:
{
  "matches": [entityId1, entityId2],
  "reasoning": "why these entities are good matches",
  "recommended": entityId_or_null
}

Matching criteria:
- Entity must have "Allowed" activities that match the request
- Entity must NOT have "Forbidden" activities that conflict with the request
- Prefer entities with a compatible mission
- If no good match exists, recommend null and explain why`;

export async function findProvider(
  requestorConstitution: string,
  serviceNeeded: string,
  availableEntities: Array<{ id: number; name: string; constitutionSummary: string }>
): Promise<ProcurementResult> {
  const entityList = availableEntities
    .map((e) => `[ID:${e.id}] ${e.name}\n  ${e.constitutionSummary}`)
    .join("\n");

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: PROCUREMENT_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          `REQUESTOR CONSTITUTION:\n${requestorConstitution}`,
          `SERVICE NEEDED:\n${serviceNeeded}`,
          `AVAILABLE ENTITIES:\n${entityList}`,
          "\nFind the best match. Output JSON only.",
        ].join("\n\n"),
      },
    ],
  });

  const text = msg.content
    .filter((block) => block.type === "text")
    .map((block) => (block as Anthropic.TextBlock).text)
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Procurement agent returned invalid JSON: ${text.slice(0, 200)}`);

  return JSON.parse(jsonMatch[0]);
}
