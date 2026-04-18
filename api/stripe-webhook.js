import Stripe from 'stripe';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = getStripeClient();
    const signature = req.headers['stripe-signature'];

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ error: 'Missing Stripe webhook signature or secret.' });
    }

    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'invoice.paid':
      case 'invoice.payment_failed':
        break;
      default:
        break;
    }

    return res.status(200).json({ received: true, type: event.type });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Webhook verification failed.' });
  }
}
