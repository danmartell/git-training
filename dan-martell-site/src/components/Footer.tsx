"use client";

const socials = [
  { label: "Twitter / X", href: "https://twitter.com/danmartell" },
  { label: "LinkedIn", href: "https://linkedin.com/in/danmartell" },
  { label: "YouTube", href: "https://youtube.com/@danmartell" },
  { label: "Instagram", href: "https://instagram.com/danmartell" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold mb-4">
              DAN <span className="text-gold-500">MARTELL</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Helping SaaS founders buy back their time and scale to exit.
              Author, investor, coach.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Quick Links
            </div>
            <div className="space-y-2">
              {["About", "Book", "SaaS Academy", "Speaking", "Investing"].map(
                (link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(/ /g, "-")}`}
                    className="block text-gray-500 hover:text-gold-500 transition-colors text-sm"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Connect
            </div>
            <div className="space-y-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-500 hover:text-gold-500 transition-colors text-sm"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Dan Martell. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
