import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, FileText, ShoppingCart, Package, BookOpen } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Document } from "@/lib/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const DocumentCard = ({ document }: { document: Document }) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(document.id);

  const [activePreview, setActivePreview] = useState(
    document.preview_urls?.[0] || ""
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(document);
  };

  const handleThumbnailClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePreview(url);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

      {/* Thumbnail */}
      <Link to={`/document/${document.id}`} className="block relative">
        <div className="aspect-4/3 w-full overflow-hidden bg-orange-50">
          {activePreview ? (
            <img
              src={activePreview}
              alt={document.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-10 w-10 text-[#E8651A]/30" />
            </div>
          )}
        </div>

        {/* Subject pill over image */}
        <span className="absolute top-3 left-3 rounded-full bg-[#E8651A] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
          {document.subject}
        </span>

        {/* Add to cart button — appears on hover */}
        <button
          onClick={handleAddToCart}
          disabled={inCart}
          className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-all duration-200
            ${inCart
              ? "bg-green-500 text-white opacity-100"
              : "bg-white text-[#E8651A] opacity-0 group-hover:opacity-100 hover:bg-[#E8651A] hover:text-white"
            }`}
        >
          {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
        </button>
      </Link>

      {/* Thumbnail strip */}
      {document.preview_urls && document.preview_urls.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto bg-gray-50 px-3 py-2 no-scrollbar">
          {document.preview_urls.map((url, idx) => (
            <button
              key={idx}
              onClick={(e) => handleThumbnailClick(e, url)}
              className={`h-10 w-8 shrink-0 overflow-hidden rounded transition-all ${
                activePreview === url
                  ? "ring-2 ring-[#E8651A] opacity-100"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <img src={url} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">

        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-[#E8651A] transition-colors">
          {document.title}
        </h3>

        {/* Meta row */}
        <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
          {document.pages && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {document.pages} pages
            </span>
          )}
          {document.doc_type && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
              {document.doc_type}
            </span>
          )}
        </div>

        {/* Package indicator */}
        {document.packages && (
          <Popover>
            <PopoverTrigger className="mb-3 flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-[#E8651A] hover:bg-orange-100 transition-colors">
              <Package className="h-3 w-3" />
              Part of a package
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                <p className="font-medium">{document.packages.title}</p>
                <p className="text-sm text-muted-foreground">This document belongs to a package.</p>
                <Link
                  to={`/package/${document.packages.id}`}
                  className="text-sm text-[#E8651A] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Package →
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-lg font-extrabold text-gray-900">
            ${document.price.toFixed(2)}
          </span>

          <Link
            to={`/document/${document.id}`}
            className="rounded-lg bg-[#E8651A]/10 px-3 py-1.5 text-xs font-semibold text-[#E8651A] transition-colors hover:bg-[#E8651A] hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;