import { BookOpen, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  const supportMessage = encodeURIComponent(
    "Hi, I need help with a document purchase."
  );

  const whatsappNumber = "+19144317855";
  const supportEmail = "stephanoouma254@gmail.com";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${supportMessage}`;
  const emailUrl = `mailto:${supportEmail}?subject=Support Request&body=${supportMessage}`;

  return (
    <footer className="border-t bg-card">
      <div className="px-6 lg:px-16 py-10">
        <div className="flex flex-col gap-10 md:gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Brand */}
          <div className="flex items-center justify-center md:justify-normal gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg text-foreground">
              EXAM TIPS & RESOURCES
            </span>
          </div>

          {/* Support */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">
            <p className="text-lg font-medium">
              Need help? Contact support
            </p>

            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-sm bg-green-600 px-4 py-2 text-md font-medium text-white transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href={emailUrl}
                className="flex items-center gap-2 rounded-sm bg-secondary px-4 py-2 text-md font-medium text-secondary-foreground transition hover:bg-primary hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 EXAM TIPS & RESOURCES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;