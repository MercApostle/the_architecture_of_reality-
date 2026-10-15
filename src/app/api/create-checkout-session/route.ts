import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    // Determine host origin and referrer
    const referer = request.headers.get("referer");
    const host = request.headers.get("origin") || referer || "http://localhost:3000";
    const origin = host.replace(/\/$/, "");

    // Optional parameters from request body
    let body: { priceId?: string; cancelUrl?: string; successUrl?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if called without payload
    }

    const cancelUrl = body.cancelUrl || referer || `${origin}/offers`;
    const targetPriceId = body.priceId || priceId;

    // Graceful fallback for local development / testing before Vercel environment variables are configured
    if (!secretKey) {
      return NextResponse.json({
        configured: false,
        url: `${origin}/success?session_id=demo_session_pending_vercel&demo=true`,
        notice:
          "STRIPE_SECRET_KEY is pending Vercel/Supabase configuration. Redirecting to the /success preview page.",
      });
    }

    // Initialize the Stripe client with the secret key from environment
    const stripe = new Stripe(secretKey, {
      typescript: true,
    });

    // Single line item using STRIPE_PRICE_ID or fallback price_data
    const line_items = targetPriceId
      ? [
          {
            price: targetPriceId,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: "cad",
              product_data: {
                name: "The Architecture of Reality — Sovereign Calibration Access",
                description: "Digital transmission and sovereign access protocol",
              },
              unit_amount: 5000, // $50.00 CAD
            },
            quantity: 1,
          },
        ];

    // Generate Stripe-hosted Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "auto",
      success_url: body.successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a valid session checkout URL.");
    }

    return NextResponse.json({
      configured: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: unknown) {
    console.error("Stripe Create Checkout Session Error:", error);
    const message = error instanceof Error ? error.message : "Failed to initialize Stripe checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
