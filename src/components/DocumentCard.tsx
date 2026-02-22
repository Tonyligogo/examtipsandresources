import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import type { Document } from "@/lib/data";
import { Button } from "./ui/button";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <Link
      to={`/document/${document.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Color header */}
      <div className="relative flex h-36 items-end bg-primary p-4">
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          <FileText className="h-3 w-3" />
          {document.fileType}
        </div>
        <h3 className="font-display text-lg leading-tight text-primary-foreground line-clamp-2">
          {document.title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {document.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {document.course}
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {document.level}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <span className="font-display text-lg font-bold text-foreground">
            ${document.price.toFixed(2)}
          </span>
          <Button className="cursor-pointer">Buy now</Button>
        </div>
      </div>
    </Link>
  );
};

export default DocumentCard;
