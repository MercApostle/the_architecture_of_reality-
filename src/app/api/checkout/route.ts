import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

interface CheckoutItem {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail, customerName } = body as {
      items: CheckoutItem[];
      customerEmail?: string;
      customerName?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // If Stripe is not configured with a secret key yet, inform the client
    if (!stripe || !isStripeConfigured) {
      return NextResponse.json(
        {
          configured: false,
          error: "Stripe API key is not yet configured in .env.local. Please provide your STRIPE_SECRET_KEY.",
        },
        { status: 200 }
      );
    }

    const host = request.headers.get("origin") || request.headers.get("referer") || "http://localhost:3000";
    const origin = host.replace(/\/$/, "");

    // Build line items for Stripe Checkout Session
    const line_items = items.map((item) => {
      // In cents (e.g. $27 -> 2700)
      const unitAmountInCents = Math.round(item.price * 100);

      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: item.title,
            description: item.subtitle || "The Architecture of Reality Sovereign Systems",
            metadata: {
              productId: item.id,
            },
          },
          unit_amount: unitAmountInCents,
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      customer_email: customerEmail && customerEmail.includes("@") ? customerEmail : undefined,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      metadata: {
        customerName: customerName || "Customer",
        itemsSummary: items.map((i) => `${i.title} (x${i.quantity})`).join(", "),
      },
    });

    return NextResponse.json({
      configured: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: unknown) {
    console.error("Stripe Checkout Session creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create Stripe Checkout session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
