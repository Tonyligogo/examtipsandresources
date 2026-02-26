import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye, BookOpen, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useSingleDocument } from "@/hooks/useDocuments";

const DocumentDetail = () => {
  const { id } = useParams();
   const { data: doc, isPending } = useSingleDocument(id);
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const [showPreview, setShowPreview] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <Loader2 className="animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="px-6 lg:px-16 flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Document not found
            </h1>
            <Link to="/catalog" className="mt-4 inline-flex items-center gap-1 text-sm hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inCart = isInCart(doc.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(doc);
  };

  const handlePurchase = () => {
    navigate(`/checkout/${doc.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="px-6 lg:px-16 flex-1 py-8">
        <Link
          to="/catalog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Header */}
            {/* Header */}
<div className="overflow-hidden rounded-xl border shadow-card">
  {doc.thumbnail_url ? (
    <div className="relative h-64 w-full bg-black">
      <img
        src={doc.thumbnail_url}
        alt={doc.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <FileText className="h-3 w-3" />
            {doc.doc_type}
          </span>

          {doc.pages && (
            <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {doc.pages} pages
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {doc.title}
        </h1>
      </div>
    </div>
  ) : (
    <div className="bg-primary p-6 md:p-8">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-medium text-primary-foreground">
          <FileText className="h-3 w-3" />
          {doc.doc_type}
        </span>

        {doc.pages && (
          <span className="rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-medium text-primary-foreground">
            {doc.pages} pages
          </span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">
        {doc.title}
      </h1>
    </div>
  )}
</div>

            {/* Description */}
            <div className="mt-6 rounded-xl border bg-card p-6 shadow-card">
              <h2 className="mb-3 font-display text-xl text-foreground">
                About this document
              </h2>

              <p className="leading-relaxed text-muted-foreground">
                {doc.description || "No description provided"}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Info label="University" value={doc.university ?? 'N/A'} Icon={BookOpen} />
                <Info label="Subject" value={doc.subject} Icon={FileText} />
                <Info
                  label="Added"
                  value={new Date(doc.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                  Icon={Calendar}
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">
                  Preview
                </h2>

                {doc.preview_url && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {showPreview ? "Hide preview" : "Show preview"}
                  </button>
                )}
              </div>

              {doc.preview_url ? (
  showPreview ? (
    <div className="relative">
      <iframe
        src={doc.preview_url}
        className="h-130 w-full rounded-lg border"
      />

      {/* 🔒 Lock overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 rounded-b-lg bg-linear-to-t from-card via-card/90 to-transparent" />

      {/* 🔒 Lock message */}
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center text-center">
        <p className="text-sm font-medium text-foreground">
          Full document locked
        </p>
        <p className="text-xs text-muted-foreground">
          Purchase to access the complete material
        </p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center rounded-lg bg-muted py-10 text-center">
      <Eye className="mb-2 h-8 w-8 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">
        Click "Show preview" to view sample pages
      </p>
    </div>
  )
) : (
  <div className="text-sm text-muted-foreground">
    No preview available
  </div>
)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 text-center">
                <span className="font-display text-4xl font-bold text-foreground">
                  ${doc.price.toFixed(2)}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  One-time purchase
                </p>
              </div>

              <Button
                onClick={handlePurchase}
                className="mb-3 w-full text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Buy & Download
              </Button>

              <Button
                onClick={handleAddToCart}
                disabled={inCart}
                className="w-full mt-4 bg-secondary text-black hover:text-white"
              >
                {inCart ? "Already in cart" : "Add to cart"}
              </Button>

              <div className="mt-6 space-y-3 border-t pt-6">
                <Meta label="Format" value={doc.doc_type} />
                <Meta label="Pages" value={doc.pages ?? "—"} />
                <Meta label="Subject" value={doc.subject} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Info = ({ label, value, Icon }: { label: string; value: string | number; Icon: React.ComponentType<{ className: string }> }) => {
  if (!value) return null;
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
};

const Meta = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default DocumentDetail;