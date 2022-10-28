const stripe = require('stripe');
const express = require('express');
// const Order = require('../../models/Order');
const app = express();
const router = express.Router();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_2245da34b7e72a8f6fa83e23748d6400b4927e37ff62e5d2c5459623ab5d8a13";

const fulfillOrder = async (session) => {
    // TODO: fill me in
    console.log("Fulfilling order", session);
const {amount, } = session
const {  city, country, line1, postal_code } = session.charges.data[0].shipping.address
    // try {
    //     const contact = await Order.create(req.body);
    //     res.status(200).json({ contact });
    //   } catch (error) {
    //     res.status(500).json(error);
    //   }
  }

  
router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
    //   console.log(paymentIntent);
    //   console.log(paymentIntent.charges.data[0].billing_details);
      console.log(paymentIntent.charges.data[0].shipping.address);
    //   fulfillOrder(paymentIntent);
      break;
    // ... handle other event types
    default:
        break;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

module.exports = router;
