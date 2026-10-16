import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  // Verify Stripe signature if webhook secret is configured
  if (secretKey && webhookSecret && signature) {
    try {
      const stripe = new Stripe(secretKey, { typescript: true });
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: unknown) {
      console.error('Stripe webhook signature verification failed:', err);
      const message = err instanceof Error ? err.message : 'Invalid signature';
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } else {
    // In local dev without live webhook secret, parse raw payload
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
      console.warn(
        '[Stripe Webhook Dev Fallback] Processing webhook event without signature verification.'
      );
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
  }

  try {
    const supabase = await createServerSupabase();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail =
          session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name;
        const customerId = session.customer as string | null;
        const metadata = session.metadata || {};

        if (supabase && customerEmail) {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, has_all_access')
            .eq('email', customerEmail)
            .maybeSingle();

          const isTrinityPassOrMembership =
            metadata.productId === 'trilogy-mastery-bundle' ||
            metadata.productId === 'members-access' ||
            session.mode === 'subscription';

          if (existingProfile) {
            await supabase
              .from('profiles')
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_status: 'active',
                has_all_access: isTrinityPassOrMembership || existingProfile.has_all_access,
                full_name: customerName || undefined,
              })
              .eq('id', existingProfile.id);

            // Record course enrollment if specific course purchased
            if (metadata.productId && metadata.productId.includes('course')) {
              await supabase.from('user_enrollments').upsert(
                {
                  user_id: existingProfile.id,
                  course_id: metadata.productId,
                  unlocked_via: isTrinityPassOrMembership ? 'all_access' : 'single_purchase',
                },
                { onConflict: 'user_id,course_id' }
              );
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        if (supabase && customerId) {
          await supabase
            .from('profiles')
            .update({
              stripe_subscription_status: status,
              has_all_access: status === 'active',
            })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      default:
        // Ignore unhandled event types cleanly
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('Error handling Stripe webhook event:', err);
    const message = err instanceof Error ? err.message : 'Webhook handler failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
