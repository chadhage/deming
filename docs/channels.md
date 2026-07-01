# Channels & Interaction Design (contract §4)

How users reach the agents. Two modes:

## 1. Embedded — Microsoft Teams (preferred)

Embedded interactions happen inside Microsoft Teams. Each agent exposes a bot/messaging
endpoint (`POST /api/channels/teams`) that handles the Bot Framework Activity protocol.

- Conversational, context-rich, identity provided by Entra ID.
- Adaptive Cards used for structured prompts (e.g., IINVEST checks, demo approvals).

## 2. Non-embedded — Web chat + SMS

When the user is not in Teams, the agent reaches them over **Web** or **SMS**, using
**North-America (US) phone numbers**.

- **SMS** (`POST /api/channels/sms`) sends a short message containing a **deep link**.
  - Default link launches the **MS Teams** chat with the agent.
  - A secondary link opens **Web chat** for users who prefer to avoid Teams.
- **Web chat** is served from the agent's Static Web App (`/chat`) and talks to the same
  `POST /api/messages` brain endpoint the Teams channel uses.

### Example SMS body

```
Your CI agent has an update. Continue in Teams: https://teams.microsoft.com/l/chat/0/0?users=<agentUpn>
Prefer the web? https://<swa-host>/chat?t=<oneTimeToken>
```

## Shared brain endpoint

All channels normalize their payload to a `ChannelMessage` and call the agent core
(`api/src/core/agent.ts`). This keeps Teams, Web, and SMS behavior consistent and testable.

```
Teams  ─┐
Web     ├─►  ChannelMessage  ─►  AgentCore.handle()  ─►  ChannelReply  ─► (per-channel renderer)
SMS    ─┘
```

## Provider notes (not provisioned by default)

- SMS uses **Azure Communication Services** (ACS) with a US toll-free or 10DLC number.
- Teams uses the **Azure Bot Service** channel registration bound to the Functions endpoint.
- These are referenced in each agent's `infra/` as commented, opt-in modules to avoid
  provisioning regulated phone resources without explicit approval.
