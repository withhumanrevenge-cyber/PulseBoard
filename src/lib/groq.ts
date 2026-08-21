const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// llama-3.3-70b-versatile was retired 2026-08-16. gpt-oss-120b is Groq's own
// recommended replacement and speaks the same tool-calling schema this file uses.
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export type ChatRole = "system" | "user" | "assistant" | "tool";

export interface ChatMessage {
  role: ChatRole;
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface GroqChoice {
  message: ChatMessage & { tool_calls?: ToolCall[] };
  finish_reason: string;
}

interface GroqResponse {
  choices: GroqChoice[];
  error?: { message: string; code?: string };
}

const DEFAULT_TIMEOUT_MS = 30_000;

export async function groqChat(opts: {
  messages: ChatMessage[];
  tools?: ToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
}): Promise<GroqChoice["message"]> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_NOT_CONFIGURED");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  if (opts.signal) opts.signal.addEventListener("abort", () => controller.abort(), { once: true });

  let res: Response;
  try {
    res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: opts.messages,
        tools: opts.tools,
        tool_choice: opts.tools?.length ? "auto" : undefined,
        temperature: opts.temperature ?? 0.4,
        max_tokens: opts.maxTokens ?? 1024,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const raw = await res.text();
  let data: GroqResponse | null = null;
  try {
    data = raw ? (JSON.parse(raw) as GroqResponse) : null;
  } catch {
    // Non-JSON body (Cloudflare 5xx HTML, etc.) — fall through to the status handler.
  }

  if (!res.ok || data?.error) {
    const detail = data?.error?.message || raw.slice(0, 200) || `HTTP ${res.status}`;
    throw new Error(`Groq request failed (${res.status}): ${detail}`);
  }

  if (!data || !data.choices?.length) {
    throw new Error("Groq returned no choices");
  }

  return data.choices[0].message;
}
