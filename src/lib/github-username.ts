// GitHub login rules: 1–39 chars, alphanumeric or single hyphens, no leading/trailing hyphen.
const GITHUB_LOGIN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function normalizeGitHubLogin(raw: string): string | null {
  let value: string;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  value = value.trim().replace(/^@/, "").replace(/\s/g, "");
  return GITHUB_LOGIN.test(value) ? value : null;
}
