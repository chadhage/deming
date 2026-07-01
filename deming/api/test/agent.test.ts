import { describe, it, expect } from "vitest";
import { AgentCore } from "../src/core/agent.js";
import { persona } from "../src/core/persona.js";
import type { ChannelMessage } from "../src/core/types.js";
import type { LlmClient } from "../src/core/llm.js";

const options = { agentUpn: "deming@contoso.com", webChatUrl: "https://example.com/chat" };
const core = new AgentCore(persona, options);

function msg(partial: Partial<ChannelMessage>): ChannelMessage {
  return { channel: "web", userId: "u1", text: "", ...partial };
}

describe("AgentCore deterministic intents", () => {
  it("greets on empty/help input", async () => {
    expect((await core.handle(msg({ text: "" }))).text).toContain(persona.name);
    expect((await core.handle(msg({ text: "help" }))).text).toContain("iteration");
  });

  it("introduces itself", async () => {
    const reply = await core.handle(msg({ text: "who are you?" }));
    expect(reply.text).toContain(persona.title);
  });

  it("lists competencies with structured data", async () => {
    const reply = await core.handle(msg({ text: "what can you do" }));
    expect(reply.data?.competencies).toEqual(persona.competencies);
  });

  it("hands off SMS with Teams-first, web fallback links", async () => {
    const reply = await core.handle(msg({ channel: "sms", text: "anything" }));
    expect(reply.links).toHaveLength(2);
    expect(reply.links?.[0].url).toContain("teams.microsoft.com");
    expect(reply.links?.[1].url).toBe("https://example.com/chat");
  });
});

describe("AgentCore open-ended input", () => {
  it("falls back deterministically when no LLM is configured", async () => {
    const reply = await core.handle(msg({ channel: "teams", text: "status report" }));
    expect(reply.text).toContain("No model configured");
  });

  it("delegates to the LLM when configured", async () => {
    const llm: LlmClient = {
      complete: async (system, user) => `SYS:${system.includes(persona.name)} USER:${user}`
    };
    const withLlm = new AgentCore(persona, options, llm);
    const reply = await withLlm.handle(msg({ channel: "teams", text: "optimize my pipeline" }));
    expect(reply.text).toBe("SYS:true USER:optimize my pipeline");
  });

  it("returns a friendly message when the LLM throws", async () => {
    const llm: LlmClient = {
      complete: async () => {
        throw new Error("rate limited");
      }
    };
    const withLlm = new AgentCore(persona, options, llm);
    const reply = await withLlm.handle(msg({ channel: "web", text: "design a landing zone" }));
    expect(reply.text).toContain("rate limited");
  });

  it("falls back when the LLM returns empty", async () => {
    const llm: LlmClient = { complete: async () => "" };
    const withLlm = new AgentCore(persona, options, llm);
    const reply = await withLlm.handle(msg({ channel: "web", text: "anything open ended" }));
    expect(reply.text).toContain("No model configured");
  });
});
