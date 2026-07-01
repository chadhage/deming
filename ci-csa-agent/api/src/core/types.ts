/** Shared channel + agent contracts. Every channel normalizes to these shapes. */

export type Channel = "teams" | "web" | "sms";

export type Ring = "canary" | "private" | "public" | "ga";

/** Normalized inbound message from any channel. */
export interface ChannelMessage {
  channel: Channel;
  /** Stable user identifier (Entra oid for Teams, phone for SMS, session id for web). */
  userId: string;
  /** Free-text user utterance. */
  text: string;
  /** Optional conversation/thread id for context continuity. */
  conversationId?: string;
  /** ISO timestamp; defaults to now when omitted. */
  timestamp?: string;
}

/** Normalized outbound reply the channel renderer turns into Teams/Web/SMS payloads. */
export interface ChannelReply {
  text: string;
  /** Optional deep links for non-embedded channels (SMS/web). */
  links?: { label: string; url: string }[];
  /** Optional structured data for rich (Teams Adaptive Card) rendering. */
  data?: Record<string, unknown>;
}

/** Persona that differentiates each agent. */
export interface AgentPersona {
  key: string;
  name: string;
  title: string;
  /** One-paragraph system framing. */
  charter: string;
  /** Capabilities the agent advertises to users. */
  competencies: string[];
}
