import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-teal-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Affirm</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Your daily source of positivity, growth, and mindful affirmations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
              Explore
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "All Affirmations", to: "/explore" },
                { label: "My Favorites", to: "/favorites" },
                { label: "Create Custom", to: "/create" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
              Categories
            </h3>
            <ul className="space-y-2">
              {[
                "Confidence",
                "Gratitude",
                "Health",
                "Love",
                "Success",
                "Mindfulness",
              ].map((cat) => (
                <li key={cat}>
                  <span className="text-white/60 text-sm">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-white/80">
              About
            </h3>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <span className="text-white/60 text-sm cursor-pointer hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/50 text-xs">
            © {year} Affirm. All rights reserved.
          </p>
          <p className="text-white/50 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
