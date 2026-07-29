import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "./auth-modal";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow">
        <div className="absolute inset-0.5 rounded-[10px] bg-white/10" />
        <Sparkles className="relative h-4 w-4 text-white" strokeWidth={2.4} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight">Sarthi<span className="text-gradient"> AI</span></span>
      </div>
    </Link>
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/search", label: "AI Search" },
  { to: "/workflow", label: "Workflow" },
  { to: "/reports", label: "Reports" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openLogin = () => {
    setAuthTab("login");
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const openRegister = () => {
    setAuthTab("register");
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "rounded-full px-3.5 py-2 text-sm font-medium text-foreground bg-secondary" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground sm:px-3.5">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-brand-gradient text-white">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="max-w-[90px] truncate sm:max-w-[120px]">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary sm:inline-flex"
                >
                  Sign in
                </button>
                <button
                  onClick={openRegister}
                  className="inline-flex items-center rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow hover:opacity-95"
                >
                  Get Started
                </button>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-full border border-border/70 bg-secondary/60 p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-border/60 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1.5">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "rounded-xl px-4 py-3 text-base font-semibold text-foreground bg-secondary" }}
                  activeOptions={{ exact: true }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {!isAuthenticated && (
              <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4">
                <button
                  onClick={openLogin}
                  className="w-full rounded-xl border border-border/70 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  Sign in
                </button>
                <button
                  onClick={openRegister}
                  className="w-full rounded-xl bg-brand-gradient py-2.5 text-center text-sm font-semibold text-white shadow-glow"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            AI-powered knowledge retrieval and multi-agent intelligence for enterprise, research, and government.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/search" className="hover:text-foreground">AI Search</Link></li>
            <li><Link to="/workflow" className="hover:text-foreground">Workflow</Link></li>
            <li><Link to="/reports" className="hover:text-foreground">Reports</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Sarthi AI. All rights reserved.</p>
          <p>Built for research, enterprise, and government.</p>
        </div>
      </div>
    </footer>
  );
}
