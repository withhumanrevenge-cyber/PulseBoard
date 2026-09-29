"use server";

import { unstable_cache } from "next/cache";
import { toPublicUrl } from "@/lib/safe-url";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const MAX_REDIRECTS = 3;

// Server actions are public endpoints, so this must never fetch an arbitrary URL:
// every hop (including redirects) is checked against private/internal ranges.
async function probe(rawUrl: string): Promise<boolean> {
  let current = rawUrl;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const url = await toPublicUrl(current);
      if (!url) return false;

      // Some hosts 405 HEAD -> retry GET.
      let response = await fetch(url, { method: "HEAD", redirect: "manual", signal: controller.signal }).catch(
        () => null
      );
      if (!response || response.status === 405) {
        response = await fetch(url, { method: "GET", redirect: "manual", signal: controller.signal }).catch(
          () => null
        );
      }
      if (!response) return false;

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) return false;
        current = new URL(location, url).toString();
        continue;
      }
      return response.status < 400;
    }
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

const cachedProbe = (url: string) =>
  unstable_cache(() => probe(url), ["deploy-probe", url], { revalidate: 900 })();

export async function verifyDeployment(url: string): Promise<boolean> {
  if (!url || typeof url !== "string" || url.length > 2048) return false;

  const limit = await rateLimit(`deploy-probe:${await clientIp()}`, { limit: 60, windowSec: 60 });
  if (!limit.ok) return false;

  try {
    return await cachedProbe(url);
  } catch {
    return false;
  }
}
