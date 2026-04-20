import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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

async function getUserProfile(adminClient, userId) {
  const { data, error } = await adminClient
    .from('profiles')
    .select('id, email, membership_type')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No profile exists for this user.');
  }

  return data;
}

async function getSubscriptionRecord(adminClient, userId) {
  const { data, error } = await adminClient
    .from('subscriptions')
    .select('stripe_customer_id, stripe_subscription_id, status')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function findOrCreateCustomer(stripe, profile, existingSubscription) {
  if (existingSubscription?.stripe_customer_id) {
    return existingSubscription.stripe_customer_id;
  }

  const customers = await stripe.customers.list({
    email: profile.email,
    limit: 1,
  });

  if (customers.data[0]?.id) {
    return customers.data[0].id;
  }

  const customer = await stripe.customers.create({
    email: profile.email,
    metadata: {
      userId: profile.id,
    },
  });

  return customer.id;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = getStripeClient();
    const adminClient = getAdminClient();
    const { customerEmail, userId } = req.body ?? {};

    if (!process.env.STRIPE_PRICE_ID_MONTHLY || !process.env.APP_BASE_URL) {
      return res.status(500).json({
        error: 'Missing required Stripe checkout configuration. Set [STRIPE_PRICE_ID_MONTHLY](.env.example) and [APP_BASE_URL](.env.example).',
      });
    }

    if (!userId || !customerEmail) {
      return res.status(400).json({ error: 'Missing required checkout payload.' });
    }

    const profile = await getUserProfile(adminClient, userId);
    const existingSubscription = await getSubscriptionRecord(adminClient, userId);
    const stripeCustomerId = await findOrCreateCustomer(stripe, profile, existingSubscription);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : customerEmail,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_MONTHLY,
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_BASE_URL}?page=membership&checkout=success`,
      cancel_url: `${process.env.APP_BASE_URL}?page=membership&checkout=cancelled`,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Unable to create Stripe checkout session.',
    });
  }
}
