import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import type { Document } from "@/lib/data";

interface CartItem {
  document: Document;
  addedAt: number;
  packageId?:string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (doc: Document) => void;
  removeItem: (docId: string) => void;
  clearCart: () => void;
  isInCart: (docId: string) => boolean;
  addPackage: (docs: Document[], packageId: string) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((doc: Document) => {
    setItems((prev) => {
      if (prev.some((i) => i.document.id === doc.id)) return prev;
      return [...prev, { document: doc, addedAt: Date.now() }];
    });
  }, []);

  const removeItem = useCallback((docId: string) => {
    setItems((prev) => prev.filter((i) => i.document.id !== docId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (docId: string) => items.some((i) => i.document.id === docId),
    [items]
  );

  const addPackage = useCallback((docs: Document[], packageId: string) => {
  setItems((prev) => {
    const newItems = [...prev];

    docs.forEach((doc) => {
      if (!newItems.some((i) => i.document.id === doc.id)) {
        newItems.push({
          document: doc,
          packageId,
          addedAt: Date.now(),
        });
      }
    });

    return newItems;
  });
}, []);
  
  const total = items.reduce((sum, i) => sum + i.document.price, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, addPackage, removeItem, clearCart, isInCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
