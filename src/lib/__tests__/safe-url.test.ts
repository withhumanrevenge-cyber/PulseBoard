import { describe, expect, it } from "vitest";
import { isPrivateIp, toPublicUrl } from "@/lib/safe-url";

describe("isPrivateIp", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254", // cloud metadata
    "100.64.0.1",
    "0.0.0.0",
    "255.255.255.255",
    "::1",
    "fd00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])("blocks %s", (ip) => {
    expect(isPrivateIp(ip)).toBe(true);
  });

  it.each(["8.8.8.8", "140.82.112.3", "172.32.0.1", "2606:4700:4700::1111"])("allows %s", (ip) => {
    expect(isPrivateIp(ip)).toBe(false);
  });
});

describe("toPublicUrl", () => {
  it.each([
    "file:///etc/passwd",
    "ftp://example.com",
    "http://localhost:3000",
    "http://127.0.0.1/",
    "http://169.254.169.254/latest/meta-data/",
    "http://[::1]/",
    "http://user:pass@8.8.8.8/",
    "http://8.8.8.8:6379/",
    "not a url",
  ])("rejects %s", async (url) => {
    expect(await toPublicUrl(url)).toBeNull();
  });

  it("accepts a public IP literal on a default port", async () => {
    expect((await toPublicUrl("https://8.8.8.8/"))?.hostname).toBe("8.8.8.8");
  });
});
