import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Loader2, ShoppingCart, Check, BookOpen } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useSingleDocument } from "@/hooks/useDocuments";

const DocumentDetail = () => {
  const { id } = useParams();
  const { data: doc, isPending } = useSingleDocument(id);
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const [activePreview, setActivePreview] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#E8651A]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <FileText className="h-8 w-8 text-[#E8651A]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Document not found</h1>
            <p className="mt-2 text-gray-500">This resource may have been removed or doesn't exist.</p>
            <Link
              to="/catalog"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#E8651A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D15A14] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inCart = isInCart(doc.id);
  const firstPreview = doc.preview_urls?.[0] || null;
  const displayPreview = activePreview || firstPreview;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(doc);
  };

  const handlePurchase = () => {
    navigate(`/checkout/${doc.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #c45210 0%, #E8651A 50%, #f07830 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative px-6 lg:px-16 py-10">
          <Link
            to="/catalog"
            className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <FileText className="h-3 w-3" />
              {doc.doc_type}
            </span>
            {doc.pages && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {doc.pages} pages
              </span>
            )}
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {doc.subject}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight max-w-2xl">
            {doc.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 lg:px-16 py-8 flex-1">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Preview images */}
            {doc.preview_urls && doc.preview_urls.length > 0 && (
              <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
                <div className="aspect-4/3 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={displayPreview!}
                    alt={doc.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {doc.preview_urls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3 bg-gray-50 no-scrollbar">
                    {doc.preview_urls.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePreview(url)}
                        className={`h-14 w-10 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          displayPreview === url
                            ? "border-[#E8651A] shadow-sm scale-105"
                            : "border-transparent opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img src={url} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#E8651A]" />
                About this resource
              </h2>
              <p className="mt-3 leading-relaxed text-gray-500 text-sm">
                {doc.description || "No description provided."}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoCard label="Subject" value={doc.subject} />
                <InfoCard label="Type" value={doc.doc_type} />
                {doc.pages && <InfoCard label="Pages" value={`${doc.pages} pages`} />}
                <InfoCard
                  label="Added"
                  value={new Date(doc.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                />
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-white p-6 shadow-sm">

              {/* Price */}
              <div className="mb-5 rounded-xl bg-orange-50 px-5 py-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#E8651A] mb-1">Price</p>
                <span className="text-4xl font-extrabold text-gray-900">
                  ${doc.price.toFixed(2)}
                </span>
                <p className="mt-1 text-xs text-gray-400">One-time purchase · Instant download</p>
              </div>

              {/* CTAs */}
              <button
                onClick={handlePurchase}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8651A] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#D15A14] hover:-translate-y-0.5"
              >
                <Download className="h-4 w-4" />
                Buy & Download
              </button>

              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition ${
                  inCart
                    ? "border-green-200 bg-green-50 text-green-600 cursor-default"
                    : "border-gray-200 text-gray-700 hover:border-[#E8651A] hover:text-[#E8651A]"
                }`}
              >
                {inCart ? (
                  <><Check className="h-4 w-4" /> In your cart</>
                ) : (
                  <><ShoppingCart className="h-4 w-4" /> Add to cart</>
                )}
              </button>

              {/* Meta */}
              <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                <MetaRow label="Format" value={doc.doc_type} />
                {doc.pages && <MetaRow label="Pages" value={`${doc.pages}`} />}
                <MetaRow label="Subject" value={doc.subject} />
                <MetaRow
                  label="Added"
                  value={new Date(doc.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-xl bg-orange-50/60 border border-orange-100 p-3">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#E8651A] mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
  </div>
);

const MetaRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

export default DocumentDetail;