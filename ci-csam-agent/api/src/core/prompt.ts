import type { AgentPersona } from "./types.js";

/**
 * Builds the system prompt that frames the LLM as this specific agent.
 * Pure and deterministic so it is fully unit-testable.
 */
export function buildSystemPrompt(persona: AgentPersona): string {
  return [
    `You are ${persona.name}, ${persona.title}.`,
    persona.charter,
    "",
    "Your competencies:",
    ...persona.competencies.map((c) => `- ${c}`),
    "",
    "Operating rules:",
    "- Stay in character and within the scope of your competencies.",
    "- Be concise and actionable; ask a clarifying question when the request is ambiguous.",
    "- Honor the continuous-improvement quality system (TDD >=80% coverage, build <180s, IINVEST gating)."
  ].join("\n");
}
