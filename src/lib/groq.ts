const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

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
  error?: { message: string };
}

export async function groqChat(opts: {
  messages: ChatMessage[];
  tools?: ToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}): Promise<GroqChoice["message"]> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_NOT_CONFIGURED");

  const res = await fetch(GROQ_URL, {
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
    signal: opts.signal,
  });

  const data = (await res.json()) as GroqResponse;

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Groq request failed (${res.status})`);
  }

  return data.choices[0].message;
}
