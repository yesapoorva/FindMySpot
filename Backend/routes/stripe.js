const express = require('express');
const Stripe = require('stripe');
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_KEY)
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1OI57WSJUTrmh9yfnbY1HDWx',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success', // Placeholder URL
      cancel_url: 'https://example.com/cancel',
    });
  
    // res.redirect(303, session.url);
    res.json({ sessionId: session.id });
  });

  module.exports = router;