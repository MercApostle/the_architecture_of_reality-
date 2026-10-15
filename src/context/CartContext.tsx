"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  subtitle?: string;
  tier?: number;
  price: number;
  quantity: number;
  category: "manual" | "workbook" | "course" | "advisory" | "book" | "bundle";
  deliverables?: string[];
  downloadUrl?: string;
  badge?: string;
}

export interface CompletedOrder {
  orderId: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    company?: string;
  };
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  cardLast4?: string;
}

interface DiscountCode {
  code: string;
  percent?: number;
  amount?: number;
  description: string;
}

const VALID_DISCOUNTS: Record<string, DiscountCode> = {
  SOVEREIGN: { code: "SOVEREIGN", percent: 15, description: "15% Sovereign Operator Scholarship" },
  ALIGN: { code: "ALIGN", amount: 10, description: "$10 Diagnostic Calibration Credit" },
  TRILOGY: { code: "TRILOGY", percent: 20, description: "20% Trilogy Reader Benefit" },
};

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: DiscountCode | null;
  discountAmount: number;
  total: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  orders: CompletedOrder[];
  recordCompletedOrder: (order: CompletedOrder) => void;
  latestOrder: CompletedOrder | null;
  hasPaidMeeting: boolean;
  meetingOrder: CompletedOrder | null;
  manuallyUnlockMeeting: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "ar_cart_items_v1";
const ORDERS_STORAGE_KEY = "ar_completed_orders_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState<DiscountCode | null>(null);
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [latestOrder, setLatestOrder] = useState<CompletedOrder | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        if (parsedOrders.length > 0) {
          setLatestOrder(parsedOrders[0]);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((i) => {
          if (i.id !== id) return i;
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        })
        .filter((i): i is CartItem => i !== null);
    });
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(null);
  };

  const applyDiscount = (code: string) => {
    const clean = code.trim().toUpperCase();
    const matched = VALID_DISCOUNTS[clean];
    if (matched) {
      setDiscount(matched);
      return { success: true, message: `Applied ${matched.description}` };
    }
    return { success: false, message: "Invalid promo code. Try 'SOVEREIGN' or 'ALIGN'." };
  };

  const removeDiscount = () => {
    setDiscount(null);
  };

  const recordCompletedOrder = (order: CompletedOrder) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
        if (
          order.items.some(
            (i) =>
              i.id.includes("intro-call") ||
              i.id.includes("session") ||
              i.category === "advisory"
          )
        ) {
          localStorage.setItem("ar_meeting_unlocked_v1", "true");
        }
      } catch {
        // ignore
      }
      return updated;
    });
    setLatestOrder(order);
    clearCart();
  };

  const [manualUnlock, setManualUnlock] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("ar_meeting_unlocked_v1") === "true") {
        setManualUnlock(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const manuallyUnlockMeeting = () => {
    setManualUnlock(true);
    try {
      localStorage.setItem("ar_meeting_unlocked_v1", "true");
    } catch {
      // ignore
    }
  };

  const meetingOrder =
    orders.find((o) =>
      o.items.some(
        (i) =>
          i.id.includes("intro-call") ||
          i.id.includes("session") ||
          i.category === "advisory"
      )
    ) || null;

  const hasPaidMeeting = !!meetingOrder || manualUnlock;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (discount) {
    if (discount.percent) {
      discountAmount = Math.round(((subtotal * discount.percent) / 100) * 100) / 100;
    } else if (discount.amount) {
      discountAmount = Math.min(subtotal, discount.amount);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        discountAmount,
        total,
        applyDiscount,
        removeDiscount,
        orders,
        recordCompletedOrder,
        latestOrder,
        hasPaidMeeting,
        meetingOrder,
        manuallyUnlockMeeting,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
