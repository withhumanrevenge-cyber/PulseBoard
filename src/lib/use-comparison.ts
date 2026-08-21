"use client";

import { useState, useEffect } from "react";

export interface UserNode {
  id: string;
  username: string;
  avatar_url: string;
}

const STORAGE_KEY = "pulse-comparison-registry";

// Guarded parse — a tampered or truncated storage value would otherwise crash
// every consumer of this hook on mount.
function readRegistry(): UserNode[] {
  try {
    const saved = typeof window === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (n): n is UserNode =>
        typeof n === "object" && n !== null && "username" in n && typeof (n as UserNode).username === "string"
    );
  } catch {
    return [];
  }
}

export function useComparisonRegistry() {
  const [selected, setSelected] = useState<UserNode[]>([]);

  useEffect(() => {
    setSelected(readRegistry());

    const syncState = () => setSelected(readRegistry());
    // Same-tab sync via custom event; cross-tab sync via the browser storage
    // event — a change in another tab now propagates too.
    window.addEventListener("pulse-registry-sync", syncState);
    window.addEventListener("storage", syncState);
    return () => {
      window.removeEventListener("pulse-registry-sync", syncState);
      window.removeEventListener("storage", syncState);
    };
  }, []);

  const toggleNode = (node: UserNode) => {
    const current = readRegistry();
    const exists = current.some((u) => u.username === node.username);
    const next = exists ? current.filter((u) => u.username !== node.username) : [...current, node];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSelected(next);
    window.dispatchEvent(new Event("pulse-registry-sync"));
  };

  const isSelected = (username: string) => selected.some((u) => u.username === username);

  const clearNodes = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelected([]);
    window.dispatchEvent(new Event("pulse-registry-sync"));
  };

  return { selected, toggleNode, isSelected, clearNodes };
}
