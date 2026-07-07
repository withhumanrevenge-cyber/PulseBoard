"use server";

export async function verifyDeployment(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    // server-side fetch: real status, no CORS. some hosts 405 HEAD -> retry GET.
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    }).catch(() => null);

    if (!response || response.status === 405) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      }).catch(() => null);
    }

    clearTimeout(timeout);
    return Boolean(response && response.status < 400);
  } catch {
    return false;
  }
}
