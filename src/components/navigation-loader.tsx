"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useBot } from "./bot-context";

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useBot();
  const loadingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Navigation finished
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const isInternal = href && (href.startsWith("/") || href.startsWith(window.location.origin));
      const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;

      if (isInternal && !isModifiedClick && anchor.target !== "_blank") {
        const targetPath = href.startsWith("/") ? href : new URL(href).pathname;
        if (targetPath !== pathname) {
          // Delay loading state to only show on non-instant transitions
          if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
          loadingTimerRef.current = setTimeout(() => {
            setIsLoading(true);
          }, 80);
        }
      }
    };

    const handlePopState = () => {
      setIsLoading(true);
    };

    document.addEventListener("click", handleLinkClick);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleLinkClick);
      window.removeEventListener("popstate", handlePopState);
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, [pathname, setIsLoading]);

  return null;
}

export function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationEvents />
    </Suspense>
  );
}
