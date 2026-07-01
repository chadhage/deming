import type { AgentPersona, ChannelMessage, ChannelReply } from "./types.js";
import type { LlmClient } from "./llm.js";
import { buildSystemPrompt } from "./prompt.js";

const TEAMS_DEEPLINK = (upn: string) =>
  `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(upn)}`;

export interface AgentCoreOptions {
  agentUpn: string;
  webChatUrl: string;
}

/**
 * Channel-agnostic agent core. Every webhook normalizes input to a ChannelMessage
 * and calls handle(); the result is rendered per channel.
 *
 * Deterministic intents (greeting, identity, competencies, SMS handoff) are answered
 * directly so they stay fast and unit-testable. Open-ended input is delegated to the
 * injected LLM; when no LLM is configured the core falls back to a deterministic reply.
 */
export class AgentCore {
  private readonly systemPrompt: string;

  constructor(
    private readonly persona: AgentPersona,
    private readonly options: AgentCoreOptions = {
      agentUpn: `${"deming"}@contoso.com`,
      webChatUrl: "https://localhost/chat"
    },
    private readonly llm: LlmClient | null = null
  ) {
    this.systemPrompt = buildSystemPrompt(persona);
  }

  async handle(message: ChannelMessage): Promise<ChannelReply> {
    const text = message.text.trim().toLowerCase();

    if (text === "" || text === "help" || text === "hi" || text === "hello") {
      return this.greeting();
    }
    if (text.includes("who are you") || text.includes("your name")) {
      return {
        text: `I am ${this.persona.name}, ${this.persona.title}. ${this.persona.charter}`
      };
    }
    if (text.includes("competenc") || text.includes("what can you do") || text.includes("skills")) {
      return {
        text: `${this.persona.name} competencies:\n- ${this.persona.competencies.join("\n- ")}`,
        data: { competencies: this.persona.competencies }
      };
    }

    // Non-embedded channels: nudge toward Teams with a web fallback (contract §4).
    if (message.channel === "sms") {
      return this.handoff(
        "I can continue here, or pick up the conversation with full context:"
      );
    }

    // Open-ended input → LLM reasoning when configured.
    if (this.llm) {
      try {
        const reply = await this.llm.complete(this.systemPrompt, message.text);
        if (reply) {
          return { text: reply };
        }
      } catch (err) {
        return {
          text: `${this.persona.name} hit an error reaching the model: ${(err as Error).message}`
        };
      }
    }

    return {
      text: `${this.persona.name} received: "${message.text}". (No model configured; set AZURE_OPENAI_ENDPOINT to enable reasoning.)`
    };
  }

  private greeting(): ChannelReply {
    return {
      text: `Hi, I'm ${this.persona.name} — ${this.persona.title}. Ask me about my competencies, or say "start iteration".`
    };
  }

  /** Builds the Teams-first, web-fallback handoff used for SMS/non-embedded flows. */
  handoff(lead: string): ChannelReply {
    return {
      text: lead,
      links: [
        { label: "Continue in Microsoft Teams", url: TEAMS_DEEPLINK(this.options.agentUpn) },
        { label: "Prefer the web? Open web chat", url: this.options.webChatUrl }
      ]
    };
  }
}
