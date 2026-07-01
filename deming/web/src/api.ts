/** Thin client for the agent brain endpoint (api/src/functions/messages.ts). */
export interface ChannelReply {
  text: string;
  links?: { label: string; url: string }[];
  data?: Record<string, unknown>;
}

export async function sendMessage(
  text: string,
  userId = "web-user",
  baseUrl = "/api"
): Promise<ChannelReply> {
  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ channel: "web", userId, text })
  });
  if (!res.ok) {
    throw new Error(`Agent request failed: ${res.status}`);
  }
  return (await res.json()) as ChannelReply;
}
