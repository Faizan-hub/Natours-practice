import axios from 'axios';
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripes = await loadStripe(
      'pk_test_51H6PqVDPm72A3Gg8HVQf6By1eB8THGZq0goZ2N9uDki3aSBaHmQs4ZemapZWy9guchjmZuppqqIp4Euc2NYG7YR800Aj5xYkko'
    );
    const session = await axios(
      `http://127.0.0.1:7676/api/v1/booking/check-out-session/${tourId}`
    );
    console.log(session);
    await stripes.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
