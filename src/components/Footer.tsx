import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="px-6 lg:px-16 py-10">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg text-foreground">StudyDocs</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 StudyDocs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
