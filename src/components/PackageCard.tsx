import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Document } from "@/lib/data";
import { useCart } from "@/context/CartContext";

interface Package {
  id: string;
  title: string;
  description: string | null;
  documents: Document[];
}

export default function PackageCard({ pkg }: { pkg: Package }) {
  const { addItem, addPackage, isInCart } = useCart();
  const [open, setOpen] = useState(false);

  const handleBuyPackage = () => {
    addPackage(pkg.documents, pkg.id);
  };

  const total = pkg.documents.reduce((sum, d) => sum + d.price, 0);
  const discounted = Math.round(total * 0.9);

  return (
    <div className="border rounded-xl p-5 shadow-sm space-y-4">

      <h2 className="text-xl font-semibold">{pkg.title}</h2>

      {pkg.description && (
        <p className="text-sm text-muted-foreground">
          {pkg.description}
        </p>
      )}

      {/* price */}
      <div className="space-y-1">
        <p className="text-sm line-through opacity-60">
          ${total.toFixed(2)}
        </p>

        <p className="text-2xl font-bold text-green-600">
          ${discounted.toFixed(2)}
        </p>

        <p className="text-xs text-muted-foreground">
          Save {Math.round(((total - discounted) / total) * 100)}%
        </p>
      </div>

      {/* toggle modules */}
      <button
        onClick={() => setOpen(!open)}
        className="text-sm underline"
      >
        {open ? "Hide Modules" : "View Modules"}
      </button>

      {open && (
        <div className="space-y-2">

          {pkg.documents.map((doc) => {
            const inCart = isInCart(doc.id);

            return (
              <div
                key={doc.id}
                className="flex justify-between items-center border rounded-md p-2"
              >
                <span className="text-sm">{doc.title}</span>

                <button
                  disabled={inCart}
                  onClick={() => addItem(doc)}
                  className={`text-xs px-2 py-1 rounded ${
                    inCart
                      ? "bg-green-500 text-white"
                      : "bg-secondary"
                  }`}
                >
                  {inCart ? "Added" : "Add"}
                </button>
              </div>
            );
          })}

        </div>
      )}

      {/* buy full package */}
      <button
        onClick={handleBuyPackage}
        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md w-full hover:opacity-90"
      >
        <ShoppingCart size={16} />
        Buy Full Package
      </button>

    </div>
  );
}