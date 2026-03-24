"use server";

export async function verifyDeployment(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3-second timeout to keep the pulse fast

    const response = await fetch(url, { 
      method: 'HEAD', 
      mode: 'no-cors',
      signal: controller.signal 
    }).finally(() => clearTimeout(timeout));

    return response.ok || response.status === 0; // status 0 is common for no-cors head requests that still resolved
  } catch (error) {
    return false;
  }
}
