import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { persona } from "../core/persona.js";

export async function health(
  _request: HttpRequest,
  _context: InvocationContext
): Promise<HttpResponseInit> {
  return {
    status: 200,
    jsonBody: {
      status: "ok",
      agent: persona.key,
      ring: process.env.AGENT_RING ?? "canary",
      time: new Date().toISOString()
    }
  };
}

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: health
});
