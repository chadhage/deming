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

/** Shared brain endpoint used by the web chat client and as the canonical entry point. */
export async function messages(
  request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json().catch(() => ({}))) as Partial<ChannelMessage>;
  if (!body.text || !body.userId) {
    return { status: 400, jsonBody: { error: "userId and text are required" } };
  }
  const message: ChannelMessage = {
    channel: body.channel ?? "web",
    userId: body.userId,
    text: body.text,
    conversationId: body.conversationId,
    timestamp: body.timestamp ?? new Date().toISOString()
  };
  return { status: 200, jsonBody: await core.handle(message) };
}

app.http("messages", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "messages",
  handler: messages
});
