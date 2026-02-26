import { Link } from "react-router-dom";
import { Check, FileText, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Document {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  university: string | null;
  doc_type: string;
  price: number;
  pages: number | null;
  preview_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(document.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(document);
  };

  return (
    <Link
      to={`/document/${document.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      {/* Header */}
      {/* Header */}
<div className="relative h-36 w-full overflow-hidden bg-primary">
  {document.thumbnail_url ? (
    <>
      <img
        src={document.thumbnail_url}
        alt={document.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/25" />
    </>
  ) : (
    <div className="flex h-full items-end p-4">
      <h3 className="font-display text-lg leading-tight text-primary-foreground line-clamp-2">
        {document.title}
      </h3>
    </div>
  )}

  {/* Doc type badge (always visible) */}
  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
    <FileText className="h-3 w-3" />
    {document.doc_type}
  </div>

  {/* Title overlay when thumbnail exists */}
  {document.thumbnail_url && (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="font-display text-lg leading-tight text-white line-clamp-2">
        {document.title}
      </h3>
    </div>
  )}
</div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {document.description || "No description provided"}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {document.university && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {document.university}
            </span>
          )}

          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {document.subject}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3">
          <span className="font-display text-lg font-bold text-foreground">
            ${document.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={inCart}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white"
            title={inCart ? "In cart" : "Add to cart"}
          >
            {inCart ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default DocumentCard;