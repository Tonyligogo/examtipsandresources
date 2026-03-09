import { Link } from "react-router-dom";
import { Mail, MessageCircle, GraduationCap, BookMarked, HelpCircle } from "lucide-react";

const Footer = () => {
  const supportMessage = encodeURIComponent("Hi, I need help with a document purchase.");
  const whatsappNumber = "+19144317855";
  const supportEmail = "stephanoouma254@gmail.com";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${supportMessage}`;
  const emailUrl = `mailto:${supportEmail}?subject=Support Request&body=${supportMessage}`;

  return (
    <footer className="bg-orange-50/60">

      {/* Main footer content */}
      <div className="px-6 lg:px-16 py-14">
        <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="font-display text-lg font-bold tracking-wide">
                Exam Tips & Resources
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Your go-to platform for nursing exam preparation. Expert-curated notes, past papers, and clinical guides to help you pass and become a confident practitioner.
            </p>

            {/* Support buttons */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-800 mb-3">
                Need help?
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-800 mb-4">
              Study
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Browse All Materials", to: "/catalog", icon: BookMarked },
                { label: "Pharmacology", to: "/catalog?subject=Pharmacology", icon: GraduationCap },
                { label: "Anatomy & Physiology", to: "/catalog?subject=Anatomy", icon: GraduationCap },
                { label: "Medical-Surgical", to: "/catalog?subject=Medical-Surgical", icon: GraduationCap },
                { label: "Critical Care", to: "/catalog?subject=Critical Care", icon: GraduationCap },
              ].map(({ label, to, icon: Icon }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-[#E8651A]"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-800 mb-4">
              Support
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Contact Support", href: whatsappUrl, external: true },
                { label: "Email Support", href: emailUrl, external: true },
                { label: "Browse Catalog", href: "/catalog", external: false },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-[#E8651A]"
                    >
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-[#E8651A]"
                    >
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 lg:px-16 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 Exam Tips & Resources. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#E8651A]" />
            <span>Built for nursing students around the world</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;