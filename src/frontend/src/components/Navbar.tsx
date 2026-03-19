import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "My Favorites", to: "/favorites" },
  { label: "Create", to: "/create" },
];

export function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const location = useLocation();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Affirm
            </span>
          </Link>

          {/* Nav links */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid="nav.link"
                  className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? "bg-teal-100 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-teal-100 -z-10"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    {identity.getPrincipal().toString().slice(0, 8)}…
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="gap-1.5"
                  data-ocid="nav.button"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5"
                data-ocid="nav.primary_button"
              >
                {isLoggingIn ? "Connecting..." : "Get Started"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
