"use client";

import { useState, useEffect } from "react";

export interface UserNode {
  id: string;
  username: string;
  avatar_url: string;
}

const STORAGE_KEY = "pulse-comparison-registry";

export function useComparisonRegistry() {
  const [selected, setSelected] = useState<UserNode[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSelected(JSON.parse(saved));

    const syncState = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSelected(JSON.parse(saved));
    };

    window.addEventListener("pulse-registry-sync", syncState);
    return () => window.removeEventListener("pulse-registry-sync", syncState);
  }, []);

  const toggleNode = (node: UserNode) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let current: UserNode[] = saved ? JSON.parse(saved) : [];
    
    const exists = current.find(u => u.username === node.username);
    if (exists) {
      current = current.filter(u => u.username !== node.username);
    } else if (current.length < 2) {
      current.push(node);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    setSelected(current);
    window.dispatchEvent(new Event("pulse-registry-sync"));
  };

  const isSelected = (username: string) => !!selected.find(u => u.username === username);

  const clearNodes = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelected([]);
    window.dispatchEvent(new Event("pulse-registry-sync"));
  };

  return { selected, toggleNode, isSelected, clearNodes };
}
