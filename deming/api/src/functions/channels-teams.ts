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
 * Microsoft Teams (Bot Framework) webhook — embedded channel.
 * Minimal Activity handling; a full deployment binds this to Azure Bot Service.
 */
export async function channelsTeams(
  request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  const activity = (await request.json().catch(() => ({}))) as {
    type?: string;
    text?: string;
    from?: { aadObjectId?: string; id?: string };
    conversation?: { id?: string };
  };

  if (activity.type && activity.type !== "message") {
    return { status: 200, jsonBody: { type: "ack" } };
  }

  const message: ChannelMessage = {
    channel: "teams",
    userId: activity.from?.aadObjectId ?? activity.from?.id ?? "unknown",
    text: activity.text ?? "",
    conversationId: activity.conversation?.id,
    timestamp: new Date().toISOString()
  };

  const reply = await core.handle(message);
  return { status: 200, jsonBody: { type: "message", text: reply.text } };
}

app.http("channels-teams", {
  methods: ["POST"],
  authLevel: "function",
  route: "channels/teams",
  handler: channelsTeams
});
