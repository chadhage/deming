import { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

/** Minimal LLM contract the agent core depends on (keeps it swappable + testable). */
export interface LlmClient {
  complete(system: string, user: string): Promise<string>;
}

const AZURE_OPENAI_SCOPE = "https://cognitiveservices.azure.com/.default";

/**
 * Creates an Azure OpenAI-backed client when configured, otherwise returns null so the
 * AgentCore falls back to deterministic behavior (used in tests and offline dev).
 *
 * Auth is keyless: managed identity in Azure, `az login` locally (DefaultAzureCredential).
 * Configure via app settings:
 *   AZURE_OPENAI_ENDPOINT   e.g. https://<resource>.openai.azure.com
 *   AZURE_OPENAI_DEPLOYMENT e.g. gpt-4o-mini
 *   AZURE_OPENAI_API_VERSION (optional, defaults below)
 */
export function createLlmClient(env: NodeJS.ProcessEnv = process.env): LlmClient | null {
  const endpoint = env.AZURE_OPENAI_ENDPOINT;
  const deployment = env.AZURE_OPENAI_DEPLOYMENT;
  if (!endpoint || !deployment) {
    return null;
  }

  const apiVersion = env.AZURE_OPENAI_API_VERSION ?? "2024-10-21";
  const azureADTokenProvider = getBearerTokenProvider(
    new DefaultAzureCredential(),
    AZURE_OPENAI_SCOPE
  );
  const client = new AzureOpenAI({ endpoint, deployment, apiVersion, azureADTokenProvider });

  return {
    async complete(system: string, user: string): Promise<string> {
      const result = await client.chat.completions.create({
        model: deployment,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      });
      return result.choices[0]?.message?.content?.trim() ?? "";
    }
  };
}
