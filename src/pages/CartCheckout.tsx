import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const CartCheckout = () => {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <h2 className="font-display text-2xl font-bold text-foreground">Cart is empty</h2>
            <Link to="/catalog" className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-6 font-medium text-secondary-foreground">
              Browse Documents
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="px-6 lg:px-16 flex-1 py-8">
        <Link to="/catalog" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
        </Link>

        <div className="mx-auto max-w-lg">
          <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Checkout ({items.length} items)</h1>

          {/* Order summary */}
          <div className="mb-6 rounded-xl border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Order Summary</h3>
            <div className="space-y-2">
              {items.map(({ document: doc }) => (
                <div key={doc.id} className="flex justify-between text-foreground">
                  <span className="line-clamp-1 flex-1 pr-4 text-sm">{doc.title}</span>
                  <span className="text-sm font-medium">${doc.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-foreground">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>

           {/* Contact payment options */}
<div className="rounded-xl border bg-card p-5 shadow-card">
  <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
    Choose Payment Method
  </h3>

  {(() => {
  const price = `$${total.toFixed(2)}`;

  const itemList = items
    .map(({ document }) => `• ${document.title} — $${document.price.toFixed(2)}`)
    .join("\n");

  const message = `Hi, I want to buy the following documents:\n\n${itemList}\n\nTotal: ${price}`;
  const encodedMessage = encodeURIComponent(message);

  const whatsappNumber = "19144317855"; // no + for wa.me
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

export default CartCheckout;
