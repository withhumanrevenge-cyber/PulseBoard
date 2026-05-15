"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

interface AuthButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function SmartAuthButton({ children, className = "", href = "/dashboard" }: AuthButtonProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div className={`${className} opacity-50`}>{children}</div>;

  if (isSignedIn) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <SignInButton mode="modal" fallbackRedirectUrl={href}>
      <button className={className}>
        {children}
      </button>
    </SignInButton>
  );
}
