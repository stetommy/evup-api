import stripe from 'stripe';
import { Response } from 'express';
import UserModel, { IUser } from '../../models/user/user.model';
import PlanModel from '../../models/plan/plan.model';

/**
 * Setup Stripe Client
 */
const config: stripe.StripeConfig = {
  apiVersion: '2023-10-16',
};
const apiKey = process.env.STRIPE_SECRET;
if (!apiKey) {
  throw new Error('Stripe API key is missing. Make sure to set the STRIPE_SECRET environment variable.');
}
const stripeClient = new stripe(apiKey, config);

/**
 * Will process payment with Stripe. On Stripe success questa funzione controlla lo stato della sessione se lo stato è pagato pulisce la stripe session e setta isActive a true.
 * @param req String
 * @param res Response
 * @returns success: true | false
 */
export async function success(userEmail: string, user: IUser, res: Response) {
  try {
    /** Retrieve stripe session */
    const OldStripeSession = await stripeClient.checkout.sessions.retrieve(user.stripeSession.id);
    /** If session payment status is paid, push plan to user */
    if (OldStripeSession.payment_status === 'paid') {
      /** Clean stripe session and set active */
      await UserModel.findOneAndUpdate({ email: userEmail }, { stripeSession: {} });
      await UserModel.findOneAndUpdate({ email: userEmail }, { isActive: true });
    }
    /** Send success response */
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('STRIPE SUCCESS ERROR => ', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Error processing success payment.' });
  }
}

/**
 * Will process payment with Stripe. Get the user email and the plan slug to process payment with Stripe set Plan name and expiration date.
 * @param userEmail String
 * @param planSlug String
 * @param res Response
 * @returns success: true | false --- message: Stripe success message --- url: url to Stripe to complete payment --- sessionId: Stripe session ID
 */
export async function processPayment(userEmail: string, planSlug: string, res: Response) {
  /** Current time stamp */
  const currentTimestamp = Math.floor(Date.now() / 1000);
  /** Looking for the user */
  const user = await UserModel.findOne({ email: userEmail });
  try {
    /**
     * Check if user have session
     * If it's valid I'll post the url of that session otherwise I'll create a new one
     */
    if (user && user.stripeSession && user.stripeSession.id) {
      /** Check if expires_at property exists and if it has expired */
      if (user.stripeSession.expires_at && user.stripeSession.expires_at > currentTimestamp) {
        /** Retrieve the Stripe session object from Stripe using the session ID */
        const OldStripeSession = await stripeClient.checkout.sessions.retrieve(user.stripeSession.id);
        /** Update stripe session on db */
        await UserModel.findOneAndUpdate({ email: userEmail }, { stripeSession: OldStripeSession });
        /** The session is valid */
        return res.status(200).json({
          success: true,
          message: 'Sessione Stripe valida.',
          url: OldStripeSession.url,
          sessionId: OldStripeSession.id,
        });
      }
    } else {
      /**
       * Create new user payment session
       */
      /** Set the session to expire 30 minutes from now */
      const expiresAt = currentTimestamp + 30 * 60;
      /** Looking for the plan in question */
      const plan = await PlanModel.findOne({ slug: planSlug });
      /** Round the price to the last two decimal places */
      const unitAmount: number = Math.round(parseFloat(plan!.price.toFixed(2)) * 100);
      /** Create stripe session */
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              unit_amount: unitAmount,
              product_data: {
                name: plan!.name,
                description: plan!.description,
                /* images: [plan.image.Location], */
              },
            },
            quantity: 1,
          },
        ],
        customer_email: user?.email,
        expires_at: expiresAt,
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `${process.env.STRIPE_SUCCESS_URL}`,
        cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
      });

      /** DEBUG PURPOSE */
      /* console.log('STRIPE_SESSION_ID => ', session); */

      /**
       * If the payment fails for some reason I save the session to db
       * User to fire into the stripe session
       */
      await UserModel.findOneAndUpdate({ email: userEmail }, { stripeSession: session });
      /** Set the name of the plan */
      await UserModel.findOneAndUpdate({ email: userEmail }, { plan: `${plan?.name}` });
      /** Set the plan expiration date today + billingrenew (expressed in months) */
      const today = new Date();
      if (plan?.billingRenew) {
        today.setMonth(today.getMonth() + plan?.billingRenew);
        await UserModel.findOneAndUpdate({ email: userEmail }, { dateRenew: today });
      }
      /** Return the success and the stripe session */
      return res
        .status(200)
        .json({ success: true, message: 'Nuova sessione Stripe.', url: session.url, sessionId: session.id });
    }
  } catch (err) {
    console.error('STRIPE SESSION ERROR => ', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Error creating Stripe session.' });
  }
}
