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

async function getSubscriptionRecord(adminClient, stripeCustomerId) {
  const { data, error } = await adminClient
    .from('subscriptions')
    .select('stripe_customer_id, status')
    .eq('stripe_customer_id', stripeCustomerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No subscription record was found for this Stripe customer.');
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = getStripeClient();
    const adminClient = getAdminClient();
    const { stripeCustomerId } = req.body ?? {};

    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Missing Stripe customer id.' });
    }

    if (!process.env.APP_BASE_URL) {
      return res.status(500).json({ error: 'Missing [APP_BASE_URL](.env.example).' });
    }

    await getSubscriptionRecord(adminClient, stripeCustomerId);

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.APP_BASE_URL}?page=membership`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Unable to create Stripe customer portal session.',
    });
  }
}
