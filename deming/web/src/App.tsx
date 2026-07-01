import { useState } from "react";
import { sendMessage, type ChannelReply } from "./api.js";

interface Turn {
  role: "user" | "agent";
  text: string;
  links?: ChannelReply["links"];
}

const AGENT_NAME = "Deming";
const AGENT_TITLE = "Agent of Agents — ASQ Certified Master Black Belt";

export function App() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setTurns((t) => [...t, { role: "user", text }]);
    setInput("");
    setBusy(true);
    try {
      const reply = await sendMessage(text);
      setTurns((t) => [...t, { role: "agent", text: reply.text, links: reply.links }]);
    } catch (err) {
      setTurns((t) => [
        ...t,
        { role: "agent", text: `Sorry, something went wrong: ${(err as Error).message}` }
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <header>
        <h1 style={{ marginBottom: 0 }}>{AGENT_NAME}</h1>
        <p style={{ color: "#5b6b63", marginTop: 4 }}>{AGENT_TITLE}</p>
      </header>

      <section aria-label="conversation" style={{ display: "grid", gap: 8, margin: "16px 0" }}>
        {turns.length === 0 && (
          <p style={{ color: "#5b6b63" }}>
            Ask about competencies, or say &quot;start iteration&quot;.
          </p>
        )}
        {turns.map((t, i) => (
          <article
            key={i}
            style={{
              justifySelf: t.role === "user" ? "end" : "start",
              background: t.role === "user" ? "#0b3d2e" : "#eef2f0",
              color: t.role === "user" ? "white" : "#10201a",
              padding: "8px 12px",
              borderRadius: 12,
              maxWidth: "85%"
            }}
          >
            <div>{t.text}</div>
            {t.links?.map((l) => (
              <div key={l.url}>
                <a href={l.url}>{l.label}</a>
              </div>
            ))}
          </article>
        ))}
      </section>

      <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
        <input
          aria-label="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccd6d1" }}
        />
        <button type="submit" disabled={busy} style={{ padding: "8px 16px" }}>
          Send
        </button>
      </form>
    </main>
  );
}
