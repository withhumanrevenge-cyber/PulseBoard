import { describe, expect, it } from "vitest";
import { normalizeGitHubLogin } from "@/lib/github-username";

describe("normalizeGitHubLogin", () => {
  it.each([
    ["torvalds", "torvalds"],
    ["@gaearon", "gaearon"],
    ["  sindresorhus ", "sindresorhus"],
    ["some-user", "some-user"],
    ["a", "a"],
    ["with%20space", "withspace"],
  ])("accepts %s", (input, expected) => {
    expect(normalizeGitHubLogin(input)).toBe(expected);
  });

  it.each(["", "-lead", "trail-", "double--hyphen", "under_score", "a".repeat(40), "../etc", "x OR 1=1", "%E0%A4%A"])(
    "rejects %s",
    (input) => {
      expect(normalizeGitHubLogin(input)).toBeNull();
    }
  );
});
