import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    if (!stripe || !isStripeConfigured) {
      return NextResponse.json({
        configured: false,
        paymentStatus: "paid",
        customerEmail: "member@architectureofreality.com",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return NextResponse.json({
      configured: true,
      id: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      amountTotal: (session.amount_total ?? 0) / 100,
      metadata: session.metadata,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_")
    ) {
      throw error;
    }
    console.error("Error retrieving Stripe session:", error);
    const message = error instanceof Error ? error.message : "Failed to retrieve session";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
