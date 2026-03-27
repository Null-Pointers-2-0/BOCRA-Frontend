import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── System prompt ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the BOCRA Digital Assistant, an intelligent AI helper 
embedded in the Botswana Communications Regulatory Authority (BOCRA) digital platform.

BOCRA regulates telecommunications, internet, broadcasting, postal services, and 
radio communications in Botswana. Established under the Communications Regulatory 
Authority Act, 2012.

You help users by:
- Answering questions about BOCRA services and regulation
- Navigating to the right page on the platform
- Fetching live data (news, tenders, licences, domain availability, etc.)
- Tracking complaints and verifying licences
- Guiding users through application processes

Available platform routes:
Public: / (home), /news, /tenders, /publications, /tariffs, /faqs
Sectors: /telecommunications, /broadcasting, /postal, /internet
Services: /domain-registry, /apply-for-license, /cybersecurity, /file-complaint
QoS: /qos/coverage, /qos/qoe, /qos/scorecard
Auth: /login, /signup
Portal (requires login): /dashboard, /applications, /licenses, /domains,
  /complaints, /alerts, /notifications, /profile, /apply

Personality: Professional, clear, and helpful. Keep responses concise.
When a user asks to go somewhere or after fetching data that has a dedicated page, end your
response with a navigation marker on its own line in this exact format:
[NAV:/path]
For example: [NAV:/tenders] or [NAV:/apply]
Do NOT include any other text on the same line as [NAV:...].
When in doubt on regulatory matters, suggest contacting info@bocra.org.bw.`;

// ── Tool definitions (OpenAI-compatible) ──────────────────────────────────────

const TOOLS: Groq.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getTenders",
      description:
        "Fetch tenders from BOCRA. Returns a list with title, reference number, closing date, and status.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            description: "Filter by status: OPEN, CLOSED, AWARDED, or CANCELLED",
          },
          search: {
            type: "string",
            description: "Search term to filter tenders",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getNews",
      description:
        "Fetch recent BOCRA news articles, press releases, and public notices.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Filter by category: NOTICE, PRESS_RELEASE, MEDIA_RELEASE, or ANNOUNCEMENT",
          },
          search: {
            type: "string",
            description: "Search term to filter news",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getLicenceTypes",
      description:
        "Get available licence types that BOCRA issues. Use this when users ask about applying for a licence or what licences are available.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description:
              "Optional search term to filter licence types by name (e.g. ISP, broadcasting, radio)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "checkDomainAvailability",
      description:
        "Check if a .bw domain name is available for registration. Returns availability status and registration fees.",
      parameters: {
        type: "object",
        properties: {
          domain_name: {
            type: "string",
            description:
              "The full domain name to check, e.g. mycompany.co.bw or brand.org.bw",
          },
        },
        required: ["domain_name"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getDomainZones",
      description:
        "Get all available .bw domain zones (co.bw, org.bw, etc.) with registration fees and eligibility criteria.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "trackComplaint",
      description:
        "Track the status of a BOCRA complaint using its reference number.",
      parameters: {
        type: "object",
        properties: {
          reference_number: {
            type: "string",
            description: "The complaint reference number, e.g. CMP-20241234",
          },
        },
        required: ["reference_number"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "verifyLicence",
      description:
        "Verify whether a BOCRA licence is valid for a given organisation.",
      parameters: {
        type: "object",
        properties: {
          licence_number: {
            type: "string",
            description: "The licence number to verify",
          },
          organisation_name: {
            type: "string",
            description: "The organisation name associated with the licence",
          },
        },
        required: ["licence_number"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getPublications",
      description:
        "Fetch BOCRA publications, reports, guidelines, and regulatory documents.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "Search term to filter publications",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getMyComplaints",
      description:
        "Get the authenticated user's complaint history. Requires the user to be logged in.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getMyApplications",
      description:
        "Get the authenticated user's licence and domain applications. Requires login.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getMyLicences",
      description:
        "Get the authenticated user's active and expired licences. Requires login.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "getMyDomains",
      description:
        "Get the authenticated user's registered .bw domains. Requires login.",
      parameters: { type: "object", properties: {} },
    },
  },
];

// ── Tool executor ──────────────────────────────────────────────────────────────

async function executeTool(
  name: string,
  args: Record<string, string>,
  authToken?: string
): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const apiFetch = async (path: string) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, { headers });
      if (!res.ok) return { error: `Request failed: ${res.status}` };
      return res.json();
    } catch {
      return { error: "Failed to reach BOCRA API" };
    }
  };

  switch (name) {
    case "getTenders": {
      const params = new URLSearchParams();
      if (args.status) params.set("status", args.status);
      if (args.search) params.set("search", args.search);
      params.set("page_size", "5");
      return apiFetch(`/tenders/?${params}`);
    }

    case "getNews": {
      const params = new URLSearchParams();
      if (args.category) params.set("category", args.category);
      if (args.search) params.set("search", args.search);
      params.set("page_size", "5");
      return apiFetch(`/news/?${params}`);
    }

    case "getLicenceTypes": {
      const params = new URLSearchParams();
      if (args.search) params.set("search", args.search);
      return apiFetch(`/licensing/types/?${params}`);
    }

    case "checkDomainAvailability":
      return apiFetch(`/domains/check/?name=${encodeURIComponent(args.domain_name)}`);

    case "getDomainZones":
      return apiFetch("/domains/zones/");

    case "trackComplaint":
      return apiFetch(
        `/complaints/track/?ref=${encodeURIComponent(args.reference_number)}`
      );

    case "verifyLicence": {
      const params = new URLSearchParams({ licence_no: args.licence_number });
      if (args.organisation_name) params.set("company", args.organisation_name);
      return apiFetch(`/licensing/verify/?${params}`);
    }

    case "getPublications": {
      const params = new URLSearchParams();
      if (args.search) params.set("search", args.search);
      params.set("page_size", "5");
      return apiFetch(`/publications/?${params}`);
    }

    case "getMyComplaints":
      return authToken
        ? apiFetch("/complaints/my-complaints/")
        : { error: "You need to be logged in to view your complaints." };

    case "getMyApplications":
      return authToken
        ? apiFetch("/licensing/applications/")
        : { error: "You need to be logged in to view your applications." };

    case "getMyLicences":
      return authToken
        ? apiFetch("/licensing/licences/")
        : { error: "You need to be logged in to view your licences." };

    case "getMyDomains":
      return authToken
        ? apiFetch("/domains/my-domains/")
        : { error: "You need to be logged in to view your domains." };

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { messages, authToken } = (await req.json()) as {
      messages: { role: string; parts: { text: string }[] }[];
      authToken?: string;
    };

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    // Convert Google-format messages to OpenAI/Groq format
    const chatMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: (m.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: m.parts.map((p) => p.text).join(""),
      })),
    ];

    if (chatMessages.length <= 1) {
      return NextResponse.json({ error: "No message provided." }, { status: 400 });
    }

    let navigateTo: string | null = null;

    // Agentic loop: keep executing tool calls until the model is done
    let iterations = 0;
    while (iterations < 5) {
      iterations++;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: chatMessages,
        tools: TOOLS,
        tool_choice: "auto",
        parallel_tool_calls: false,
      });

      const assistantMsg = response.choices[0].message;
      chatMessages.push(assistantMsg as Groq.Chat.Completions.ChatCompletionMessageParam);

      if (!assistantMsg.tool_calls?.length) break;

      // Execute all tool calls and append results
      for (const call of assistantMsg.tool_calls) {
        const args = (JSON.parse(call.function.arguments) ?? {}) as Record<string, string>;
        const output = await executeTool(call.function.name, args, authToken);

        chatMessages.push({
          role: "tool",
          content: JSON.stringify(output),
          tool_call_id: call.id,
        });
      }
    }

    // Extract the last assistant text response, then parse out any [NAV:/path] marker
    const lastAssistant = [...chatMessages].reverse().find((m) => m.role === "assistant");
    let text = typeof lastAssistant?.content === "string" ? lastAssistant.content : "";

    // Parse navigation marker: [NAV:/some/path]
    const navMatch = text.match(/\[NAV:(\/[^\]\s]*)\]/);
    if (navMatch) {
      navigateTo = navMatch[1];
      text = text.replace(/\[NAV:\/[^\]\s]*\]/g, "").trim();
    }

    return NextResponse.json({ text, navigateTo });
  } catch (err) {
    console.error("[AI Chat]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
