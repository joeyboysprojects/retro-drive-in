import Stripe from 'stripe';

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
    const { customerEmail, userId } = req.body ?? {};

    if (!process.env.STRIPE_PRICE_ID_MONTHLY || !process.env.APP_BASE_URL) {
      return res.status(500).json({
        error: 'Missing required Stripe checkout configuration. Set [STRIPE_PRICE_ID_MONTHLY](.env.example) and [APP_BASE_URL](.env.example).',
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_MONTHLY,
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_BASE_URL}?page=membership&checkout=success`,
      cancel_url: `${process.env.APP_BASE_URL}?page=membership&checkout=cancelled`,
      metadata: {
        userId: userId ?? '',
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
