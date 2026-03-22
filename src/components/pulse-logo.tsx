import { Activity } from "lucide-react";

export function PulseLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
      <Activity className="absolute inset-0 w-full h-full animate-pulse opacity-40 scale-110" />
      <Activity className="w-full h-full relative z-10 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
    </div>
  );
}

