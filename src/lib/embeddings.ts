// Lexical feature-hash embeddings (the hashing trick). Deterministic, no API key.
// Swap embed() for a hosted embedding endpoint to upgrade; keep EMBED_DIM.

export const EMBED_DIM = 256;

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "for", "on", "with", "is",
  "are", "was", "this", "that", "it", "as", "at", "by", "be", "from", "my",
]);

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function charBigrams(token: string): string[] {
  if (token.length < 3) return [];
  const grams: string[] = [];
  for (let i = 0; i < token.length - 1; i++) grams.push(token.slice(i, i + 2));
  return grams;
}

// Language tokens are repeated so stack alignment dominates similarity.
export function profileToDocument(input: {
  name?: string | null;
  username?: string;
  bio?: string | null;
  topLanguage?: string | null;
  languages?: string[];
  repoText?: string;
}): string {
  const parts: string[] = [];
  if (input.name) parts.push(input.name);
  if (input.username) parts.push(input.username);
  if (input.bio) parts.push(input.bio);
  if (input.topLanguage) parts.push(`${input.topLanguage} ${input.topLanguage} ${input.topLanguage}`);
  if (input.languages?.length) parts.push(input.languages.join(" ") + " " + input.languages.join(" "));
  if (input.repoText) parts.push(input.repoText);
  return parts.join(" \n ");
}

export function embed(text: string): number[] {
  const vec = new Array<number>(EMBED_DIM).fill(0);
  if (!text) return vec;

  const tokens = tokenize(text);
  for (const token of tokens) {
    vec[fnv1a(token) % EMBED_DIM] += 1;
    for (const bg of charBigrams(token)) {
      vec[fnv1a("##" + bg) % EMBED_DIM] += 0.3;
    }
  }

  let norm = 0;
  for (const v of vec) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < vec.length; i++) vec[i] = vec[i] / norm;
  return vec;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}
