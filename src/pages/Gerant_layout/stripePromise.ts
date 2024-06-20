// stripePromise.ts

import { loadStripe } from '@stripe/stripe-js';

// Replace with your own Stripe publishable key
const stripePromise = loadStripe('pk_test_51PLDifP9wsPPbHmQfgR3qfLmbPOENaHpt4e4Z1OEQ9T0RQf1auNYVF9y8wkvzaJteTHiF7pGB5tlniHDHFsopXJC00JdxrZ9xM');

export default stripePromise;
