import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AgentCore } from "../core/agent.js";
import { createLlmClient } from "../core/llm.js";
import { persona } from "../core/persona.js";
import type { ChannelMessage } from "../core/types.js";

const core = new AgentCore(
  persona,
  {
    agentUpn: process.env.AGENT_UPN ?? `${persona.key}@contoso.com`,
    webChatUrl: process.env.WEB_CHAT_URL ?? "https://localhost/chat"
  },
  createLlmClient()
);

/**
 * SMS webhook (Azure Communication Services inbound) — non-embedded channel.
 * Replies normalize to a Teams deep link with a web-chat fallback (contract §4).
 */
export async function channelsSms(
  request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json().catch(() => ({}))) as {
    from?: string;
    message?: string;
  };

  const message: ChannelMessage = {
    channel: "sms",
    userId: body.from ?? "unknown",
    text: body.message ?? "",
    timestamp: new Date().toISOString()
  };

  const reply = await core.handle(message);
  const linkText = (reply.links ?? [])
    .map((l) => `${l.label}: ${l.url}`)
    .join("\n");

  return {
    status: 200,
    jsonBody: {
      to: body.from,
      message: [reply.text, linkText].filter(Boolean).join("\n")
    }
  };
}

app.http("channels-sms", {
  methods: ["POST"],
  authLevel: "function",
  route: "channels/sms",
  handler: channelsSms
});
