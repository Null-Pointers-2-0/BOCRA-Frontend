# BOCRA AI Site Navigator — Gemini Implementation Plan

## Overview

A floating chat widget powered by **Gemini 2.0 Flash** (function calling) that lets users ask anything about BOCRA, navigate to any page, and query live data — all without leaving the current page.

The model doesn't just respond with text; it invokes declared tools that map directly to the backend API and the Next.js router. Gemini decides which tool(s) to call based on what the user asks.

---

## Architecture

```
User → Chat Widget (React, floating overlay)
            ↓
      Next.js API Route  /api/ai/chat  (server-side proxy)
            ↓
      Gemini API  (gemini-2.0-flash)
      + Function Declarations (tools)
            ↓  tool_call result
      Execute tool on server (API calls) OR
      Return navigation intent to client
            ↓
      Feed tool result back to Gemini → final response
            ↓
      Stream response to chat widget
```

The API key **never** touches the browser — the `/api/ai/chat` Next.js API route acts as a secure proxy.

---

## Package

```bash
npm install @google/generative-ai
```

Single official SDK. No other AI dependencies needed.

---

## Environment Setup

```env
# .env.local (BOCRA-Frontend)
GEMINI_API_KEY=your_key_here
```

---

## Tools / Function Declarations

| Tool Name | Maps to Backend | What it does |
|---|---|---|
| `navigate` | `router.push()` (client) | Navigate to any route |
| `getLicenceTypes` | `GET /licensing/types/` | List available licences, optionally filter by sector |
| `getLicenceSectors` | `GET /licensing/sectors/` | List licence sectors (Telecom, Broadcasting, etc.) |
| `checkDomainAvailability` | `GET /domains/check/` | Live .bw domain availability check |
| `getDomainZones` | `GET /domains/zones/` | List all .bw domain zones with fees |
| `getNews` | `GET /news/` | Fetch recent news articles, optionally filter by category |
| `getTenders` | `GET /tenders/` | List tenders, optionally filter by status (OPEN/CLOSED) |
| `getPublications` | `GET /publications/` | Fetch publications/reports |
| `trackComplaint` | `GET /complaints/track/?ref=` | Track a complaint by reference number |
| `verifyLicence` | `GET /licensing/verify/` | Verify a licence by number and organisation |
| `getAlertCategories` | `GET /alerts/categories/` | List available alert subscription categories |
| `getCoverageOperators` | `GET /qos/coverage/` | Get coverage data by operator |
| `searchFAQs` | `GET /core/faqs/` | Answer common regulatory questions |

### Authenticated-only tools (require Bearer token)

| Tool Name | maps to | What it does |
|---|---|---|
| `getMyComplaints` | `GET /complaints/my-complaints/` | User's own complaints |
| `getMyLicences` | `GET /licensing/licences/` | User's active licences |
| `getMyDomains` | `GET /domains/my-domains/` | User's registered domains |
| `getMyApplications` | `GET /licensing/applications/` | User's licence/domain applications |
| `getMyNotifications` | `GET /notifications/` | User's unread notifications |

---

## API Route: `/api/ai/chat/route.ts`

```typescript
// app/api/ai/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { messages, authToken } = await req.json();
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
  });

  const chat = model.startChat({ history: messages.slice(0, -1) });
  const lastMessage = messages.at(-1).parts[0].text;

  let result = await chat.sendMessage(lastMessage);

  // Handle function calls in a loop (Gemini may chain multiple calls)
  while (result.response.functionCalls()?.length) {
    const calls = result.response.functionCalls()!;
    const functionResponses = await Promise.all(
      calls.map(async (call) => ({
        functionResponse: {
          name: call.name,
          response: await executeTool(call.name, call.args, authToken),
        },
      }))
    );
    result = await chat.sendMessage(functionResponses);
  }

  // Check if result contains a navigate action (handled client-side)
  const text = result.response.text();
  return NextResponse.json({ text, navigateTo: extractNavigation(result) });
}
```

---

## System Prompt

```
You are the BOCRA Digital Assistant, an AI helper for the Botswana Communications 
Regulatory Authority (BOCRA) digital platform.

BOCRA regulates telecommunications, internet, broadcasting, postal services, and 
radio communications in Botswana. It was established by the Communications 
Regulatory Authority Act, 2012.

You can help users:
- Find information about licences, tenders, news, and publications
- Check .bw domain availability and registration
- Navigate to any section of the platform
- Track complaint status by reference number
- Verify licence validity
- Understand regulatory processes

Available routes on this platform:
- / (home), /news, /tenders, /publications, /tariffs, /faqs
- /domain-registry (availability check & WHOIS)
- /apply-for-license (apply for any licence or domain)
- /telecommunications, /broadcasting, /postal, /internet
- /cybersecurity (COMM-CIRT services)
- /file-complaint (public complaint submission)
- /qos/coverage, /qos/qoe, /qos/scorecard
- /login, /signup (authentication)
- Portal routes (require login): /dashboard, /applications, /licenses, /domains,
  /complaints, /alerts, /notifications, /profile, /apply

Always be professional, helpful, and concise. When you navigate the user somewhere, 
briefly explain what they'll find there. For regulatory questions you're unsure about, 
direct users to contact BOCRA directly at info@bocra.org.bw.
```

---

## Chat Widget Component

```
components/AIAssistant/
  AIAssistant.tsx        — Floating button + chat panel
  ChatMessage.tsx        — Individual message bubble
  TypingIndicator.tsx    — Animated dots while Gemini responds
```

### Behaviour
- Fixed bottom-right position (`fixed bottom-6 right-6 z-50`)
- Works on both the public site (Navbar pages) and the portal (PortalSidebar pages)
- Detects auth state via `getTokens()` to unlock authenticated tools
- Streaming responses: uses `sendMessageStream` for real-time text display
- Multi-turn: maintains conversation history in component state
- Navigation: receives `navigateTo` from API route and calls `router.push()` client-side

### Chat state shape
```typescript
type Message = {
  role: "user" | "model";
  parts: [{ text: string }];
};
```

---

## Example Conversations

### Navigate + fetch live data
> **User**: Show me all open tenders  
> Gemini calls `getTenders({ status: "OPEN" })` + `navigate({ path: "/tenders" })`  
> **Response**: "Found 3 open tenders. Taking you there now — [list with titles & closing dates]"

### Domain check
> **User**: Is bocra.co.bw available?  
> Gemini calls `checkDomainAvailability({ name: "bocra.co.bw" })`  
> **Response**: "bocra.co.bw is not available. It's registered in the .co.bw zone."

### Authenticated query
> **User**: How many of my licence applications are pending?  
> Gemini calls `getMyApplications()` with auth token  
> **Response**: "You have 2 applications under review: [APP-XXXXXX, APP-YYYYYY]"

### Cross-tool reasoning
> **User**: What ISP licences can I apply for and how much do they cost?  
> Gemini calls `getLicenceTypes({ sector: "internet" })`  
> **Response**: Formatted comparison table of ISP licence options with fees

---

## Implementation Steps

### Phase 1 — Core (1-2 hours)
1. Add `GEMINI_API_KEY` to `.env.local`
2. `npm install @google/generative-ai`
3. Create `app/api/ai/chat/route.ts` with system prompt + navigate tool only
4. Create `AIAssistant.tsx` floating widget (button → panel → input → messages)
5. Wire to API route, test basic Q&A and navigation

### Phase 2 — Public Data Tools (1-2 hours)
6. Add `executeTool()` in the API route with all public tools
7. Add function declarations for: getTenders, getNews, getLicenceTypes, checkDomain, trackComplaint, verifyLicence
8. Test multi-tool scenarios

### Phase 3 — Authenticated Tools (1 hour)
9. Pass auth token from `getTokens().accessToken` in the request body
10. Add authenticated tools: getMyComplaints, getMyLicences, getMyDomains, getMyApplications
11. Scope these tools based on whether `authToken` is present

### Phase 4 — Polish (optional)
12. Add streaming (replace `sendMessage` with `sendMessageStream`)
13. Add suggested prompts on widget open: "Check domain", "Open tenders", "My licences"
14. Add tool call status indicators ("Checking availability…")
15. Persist conversation for the session via localStorage

---

## Cost Estimate

Gemini 2.0 Flash pricing (as of 2026):
- Input: $0.075 / 1M tokens
- Output: $0.30 / 1M tokens

A typical conversation (10 turns with tool calls) ≈ ~3,000 tokens = **< $0.001 per conversation**. Essentially free at hackathon scale.

---

## Files to Create/Modify

```
BOCRA-Frontend/
  .env.local                              ← add GEMINI_API_KEY
  package.json                            ← add @google/generative-ai
  app/api/ai/chat/route.ts                ← NEW: API proxy route
  components/AIAssistant/
    AIAssistant.tsx                       ← NEW: floating widget
    ChatMessage.tsx                       ← NEW: message bubbles
    TypingIndicator.tsx                   ← NEW: loading state
  app/layout.tsx                          ← add <AIAssistant /> globally
  app/(portal)/layout.tsx                 ← optionally add portal-aware instance
```
