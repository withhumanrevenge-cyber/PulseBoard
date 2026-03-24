import { SignUp } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default async function SignUpPage(props: { params: Promise<{ "sign-up"?: string[] }> }) {
  const params = await props.params;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdfdfd] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] blur-[150px] rounded-full -z-10" />
      
      <div className="w-full max-w-md space-y-12 relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 outline-none">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10 shadow-xl shadow-primary/5">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase">PulseBoard</span>
        </Link>

        <div className="w-full flex justify-center shadow-2xl rounded-3xl overflow-hidden border border-black/5 bg-white">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-8 font-sans",
                headerTitle: "text-2xl font-black tracking-tight uppercase text-black",
                headerSubtitle: "text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground pt-1",
                socialButtonsBlockButton: "rounded-2xl border-black/5 hover:bg-black/[0.02] transition-colors py-3 shadow-none",
                socialButtonsBlockButtonText: "text-[11px] font-bold uppercase tracking-widest",
                formButtonPrimary: "bg-black hover:bg-black/90 rounded-2xl py-3 text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-black/10",
                formFieldInput: "rounded-xl border-black/5 bg-black/[0.02] py-3 text-sm focus:border-primary/50 transition-all",
                footerActionText: "text-[10px] font-bold uppercase tracking-widest opacity-60",
                footerActionLink: "text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors",
                identityPreviewText: "text-xs font-bold",
                identityPreviewEditButton: "text-xs text-primary",
                formResendCodeLink: "text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors",
              }
            }}
          />
        </div>

        <div className="pt-8 text-center"><p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-10">Consensus Identity Protocol</p></div>
      </div>
    </div>
  );
}
