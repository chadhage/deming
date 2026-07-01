import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "../src/core/prompt.js";
import { persona } from "../src/core/persona.js";

describe("buildSystemPrompt", () => {
  it("frames the LLM as the agent persona", () => {
    const prompt = buildSystemPrompt(persona);
    expect(prompt).toContain(persona.name);
    expect(prompt).toContain(persona.title);
    expect(prompt).toContain(persona.charter);
  });

  it("includes every competency", () => {
    const prompt = buildSystemPrompt(persona);
    for (const c of persona.competencies) {
      expect(prompt).toContain(c);
    }
  });

  it("states the operating rules", () => {
    expect(buildSystemPrompt(persona)).toContain("IINVEST");
  });
});
