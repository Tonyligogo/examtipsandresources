import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { documents } from "@/lib/data";

const Checkout = () => {
  const { id } = useParams();
  const doc = documents.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center">
          <p className="text-foreground">Document not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="px-6 lg:px-16 flex-1 py-8">
        <Link to={`/document/${id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to document
        </Link>

        <div className="mx-auto max-w-lg">
          <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Checkout</h1>

          {/* Order summary */}
          <div className="mb-6 rounded-xl border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Order Summary</h3>
            <div className="flex justify-between text-foreground">
              <span className="line-clamp-1 flex-1 pr-4 text-sm">{doc.title}</span>
              <span className="font-display text-lg font-bold">${doc.price.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-foreground">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl font-bold">${doc.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Contact payment options */}
<div className="rounded-xl border bg-card p-5 shadow-card">
  <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
    Choose Payment Method
  </h3>

  {(() => {
    const price = `$${doc.price.toFixed(2)}`;
    const message = `Hi, I want to buy "${doc.title}" listed for ${price}.`;
    const encodedMessage = encodeURIComponent(message);

    const whatsappNumber = "+19144317855";
    const emailAddress = "stephanoouma254@gmail.com";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      "Document Purchase"
    )}&body=${encodedMessage}`;

    return (
      <div className="space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-green-600 font-medium text-white transition hover:opacity-90"
        >
          Pay via WhatsApp
        </a>

        <a
          href={emailUrl}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-secondary font-medium text-secondary-foreground transition hover:bg-primary hover:text-white"
        >
          Pay via Email
        </a>
      </div>
    );
  })()}
</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
