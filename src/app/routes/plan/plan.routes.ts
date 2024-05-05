import express from 'express';
import { Request, Response } from 'express';
import loadEnv from '../../services/env';
import PlanModel from '../../models/plan/plan.model';
import UserModel from '../../models/user/user.model';
import slugify from 'slugify';
import authenticateToken from '../../middlewares/authenticate-token';
import { AdminLimited } from '../../middlewares/limited-access';
import { success, processPayment } from '../../services/stripe';

const route = express.Router();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/create', authenticateToken, AdminLimited, createPlan);
route.get('/read', authenticateToken, readPlans);
route.delete('/remove/:planSlug', authenticateToken, AdminLimited, removePlans);
route.post('/buy/:userEmail/:planSlug', authenticateToken, buyPlans);
route.get('/stripe/success/:userEmail', authenticateToken, stripeSuccess);

/**
 * Will create plan
 * @param req Request
 * @param res Response
 * @returns Return the Saved Plan
 * @abstract This function insert new plan
 */
async function createPlan(req: Request, res: Response) {
  try {
    const data = req.body;
    /** Data validation */
    if (!data.name) return res.status(400).json({ success: false, error: 'No plan name' });
    if (!data.description) return res.status(400).json({ success: false, error: 'No plan description' });
    if (!data.price) return res.status(400).json({ success: false, error: 'No plan price' });
    if (!data.billingRenew) return res.status(400).json({ success: false, error: 'No plan billingRenew' });
    if (!data.includedItems) return res.status(400).json({ success: false, error: 'No plan includedItems' });
    /** Check if this plan already exists */
    const alreadyExist = await PlanModel.findOne({ slug: slugify(data.name) });
    if (alreadyExist) return res.status(400).json({ success: false, error: 'Plan name already existing' });
    /** Creating new plan */
    await PlanModel.create({ ...data, slug: slugify(data.name) });
    /** Return created plan */
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('HANDLE CREATE NEW PLAN ERROR => ', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Failed to create plan. Please try again.' });
  }
}

/**
 * Will read all plan and return all plans in array.
 * @param req
 * @param res
 * @returns []
 */
async function readPlans(req: Request, res: Response) {
  try {
    /** Find all plan */
    const plans = await PlanModel.find();
    /** Return the plan [] */
    return res.status(200).send(plans);
  } catch (err) {
    console.error('READ PLAN ERROR => ', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Failed to read plan. Please try again.' });
  }
}

/**
 * Will delete the plan from ID.
 * @param req
 * @param res
 * @returns success: true
 */
async function removePlans(req: Request, res: Response) {
  try {
    /** Retrieve the plan id from the request parameters */
    const { planSlug } = req.params;
    /** Check if this plan already exists */
    const alreadyExist = await PlanModel.findOne({ slug: planSlug });
    if (!alreadyExist) return res.status(400).json({ success: false, error: 'Plan doesnt existing' });
    /** Delete the plan */
    await PlanModel.findOneAndDelete({ slug: planSlug });
    /** Return success response */
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('REMOVE PLAN ERROR => ', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Failed to remove plan. Please try again.' });
  }
}

/**
 * Will complete purchase course plans. Check if the user already has an active plan, or call the function to process the purchase of a new plan.
 * @param req Request
 * @param res Response
 * @returns Only error from this check
 */
async function buyPlans(req: Request, res: Response) {
  /** Get user */
  const userEmail = req.params.userEmail;
  const planSlug = req.params.planSlug;
  try {
    /** I search for the user by id */
    const user = await UserModel.findOne({ email: userEmail });
    /** I check if he already has an active plan */
    if (user?.isActive) {
      /** User already has an active plan, return */
      return res.status(409).json({ success: false, error: 'The plan is already active!' });
    } else {
      /** Call to the function that processes payment for the course */
      return processPayment(userEmail, planSlug, res);
    }
  } catch (err) {
    console.error('HANDLE BUY PLAN ERROR => ', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Failed to buy plan.' });
  }
}

async function stripeSuccess(req: Request, res: Response) {
  /** Get user */
  const userEmail = req.params.userEmail;
  /** Find user from db to get stripe session id (logged in user) */
  const user = await UserModel.findOne({ email: userEmail });
  /** Se l'utente non esiste ritorna errore */
  if (!user) return res.status(404).json({ success: false, error: 'No user found' });
  /** If no stripe session return */
  if (!user.stripeSession.id) return res.status(400).json({ success: false, error: 'No Stripe session found' });
  /** Call verify stripeSuccess function */
  success(userEmail, user, res);
}

export default route;
