import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing [STRIPE_SECRET_KEY](.env.example).');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
}

function getAdminClient() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing [VITE_SUPABASE_URL](.env.example) or [SUPABASE_SERVICE_ROLE_KEY](.env.example).');
  }

  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getUserIdFromStripeObject(object) {
  return (
    object?.metadata?.userId ||
    object?.client_reference_id ||
    object?.subscription_details?.metadata?.userId ||
    object?.parent?.subscription_details?.metadata?.userId ||
    null
  );
}

async function upsertSubscription(adminClient, payload) {
  const { error } = await adminClient.from('subscriptions').upsert(payload, { onConflict: 'stripe_subscription_id' });

  if (error) {
    throw error;
  }
}

async function updateMembership(adminClient, userId, membershipType) {
  const { error } = await adminClient
    .from('profiles')
    .update({
      membership_type: membershipType,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    throw error;
  }
}

async function insertBillingEvent(adminClient, payload) {
  const { error } = await adminClient.from('billing_events').insert(payload);

  if (error) {
    throw error;
  }
}

async function findUserIdByCustomerId(adminClient, stripeCustomerId) {
  if (!stripeCustomerId) {
    return null;
  }

  const { data, error } = await adminClient
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.user_id || null;
}

async function handleCheckoutCompleted(adminClient, stripe, event) {
  const session = event.data.object;
  const userId = getUserIdFromStripeObject(session);
  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
  const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  await upsertSubscription(adminClient, {
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: subscription.id,
    plan_code: subscription.items.data[0]?.price?.id || process.env.STRIPE_PRICE_ID_MONTHLY || 'monthly',
    status: subscription.status,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  });

  await updateMembership(adminClient, userId, ['active', 'trialing'].includes(subscription.status) ? 'paid' : 'free');
}

async function handleSubscriptionChanged(adminClient, event) {
  const subscription = event.data.object;
  const userId = getUserIdFromStripeObject(subscription) || (await findUserIdByCustomerId(adminClient, subscription.customer));

  if (!userId) {
    return;
  }

  await upsertSubscription(adminClient, {
    user_id: userId,
    stripe_customer_id: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id,
    stripe_subscription_id: subscription.id,
    plan_code: subscription.items.data[0]?.price?.id || process.env.STRIPE_PRICE_ID_MONTHLY || 'monthly',
    status: subscription.status,
    current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    updated_at: new Date().toISOString(),
  });

  await updateMembership(adminClient, userId, ['active', 'trialing'].includes(subscription.status) ? 'paid' : 'free');
}

async function handleInvoiceEvent(adminClient, event) {
  const invoice = event.data.object;
  const stripeCustomerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
  const userId = getUserIdFromStripeObject(invoice) || (await findUserIdByCustomerId(adminClient, stripeCustomerId));

  if (!userId) {
    return;
  }

  await insertBillingEvent(adminClient, {
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
    stripe_invoice_id: invoice.id || null,
    stripe_payment_intent_id: typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.payment_intent?.id || null,
    event_type: event.type,
    amount: typeof invoice.amount_paid === 'number' ? invoice.amount_paid / 100 : typeof invoice.amount_due === 'number' ? invoice.amount_due / 100 : null,
    currency: invoice.currency || null,
    status: invoice.status || null,
    paid_at: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
    metadata: {
      stripeEventId: event.id,
      billingReason: invoice.billing_reason,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
    },
  });

  if (event.type === 'invoice.payment_failed') {
    await updateMembership(adminClient, userId, 'free');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = getStripeClient();
    const adminClient = getAdminClient();
    const signature = req.headers['stripe-signature'];

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ error: 'Missing Stripe webhook signature or secret.' });
    }

    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(adminClient, stripe, event);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChanged(adminClient, event);
        break;
      case 'invoice.paid':
      case 'invoice.payment_failed':
        await handleInvoiceEvent(adminClient, event);
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true, type: event.type });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Webhook verification failed.' });
  }
}
