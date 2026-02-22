import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye, User, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { documents } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const DocumentDetail = () => {
  const { id } = useParams();
  const doc = documents.find((d) => d.id === id);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="px-6 lg:px-16 flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Document not found</h1>
            <Link to="/catalog" className="mt-4 inline-flex items-center gap-1 text-sm text-secondary hover:underline">
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
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header card */}
            <div className="overflow-hidden rounded-xl border bg-primary shadow-card">
              <div className="p-6 md:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-medium text-primary-foreground">
                    <FileText className="h-3 w-3" />
                    {doc.fileType}
                  </span>
                  <span className="rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-medium text-primary-foreground">
                    {doc.pages} pages
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">
                  {doc.title}
                </h1>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 rounded-xl border bg-card p-6 shadow-card">
              <h2 className="mb-3 font-display text-xl text-foreground">About this document</h2>
              <p className="leading-relaxed text-muted-foreground">{doc.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: User, label: "Author", value: doc.author },
                  { icon: BookOpen, label: "Course", value: doc.course },
                  { icon: FileText, label: "Subject", value: doc.subject },
                  { icon: Calendar, label: "Added", value: new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-lg bg-muted p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="h-3 w-3" />
                      {label}
                    </div>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">Preview</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {showPreview ? "Hide preview" : "Show preview"}
                </button>
              </div>
              {showPreview ? (
                <div className="relative">
                  <pre className="whitespace-pre-wrap rounded-lg bg-muted p-5 font-body text-sm leading-relaxed text-foreground">
                    {doc.previewText}
                  </pre>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card to-transparent" />
                </div>
              ) : (
                <div className="flex flex-col items-center rounded-lg bg-muted py-10 text-center">
                  <Eye className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Click "Show preview" to see a sample of the content</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Purchase card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 text-center">
                <span className="font-display text-4xl font-bold text-foreground">
                  ${doc.price.toFixed(2)}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">One-time purchase</p>
              </div>

              <Button
                onClick={handlePurchase}
                className="mb-3 cursor-pointer flex w-full items-center justify-center gap-2 font-medium text-white"
              >
                <Download className="h-4 w-4" />
                Buy & Download
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Instant access after payment. Secure transaction.
              </p>

               <Button
              onClick={handleAddToCart}
              disabled={inCart}
              className="w-full mt-4 bg-secondary text-black hover:text-white"
            >
              {inCart ? "Already In cart" : "Add to cart"}
            </Button>

              <div className="mt-6 space-y-3 border-t pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium text-foreground">{doc.fileType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pages</span>
                  <span className="font-medium text-foreground">{doc.pages}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium text-foreground">{doc.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DocumentDetail;
