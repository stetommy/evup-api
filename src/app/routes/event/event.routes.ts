import express from 'express';
import loadEnv from '../../services/env';
import { Request, Response } from 'express';
import EventModel from '../../models/event/event.model';
import authenticateToken from '../../middlewares/authenticate-token';
import { OrganizerLimited } from '../../middlewares/limited-access';
import slugify from 'slugify';
import { getAllEvents, getEventBySlug, getOrganizerEvent } from './getEvent/getEvent.routes';

/** Router definition */
const route = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/create', authenticateToken, OrganizerLimited, createEvent);
route.put('/update/:eventSlug', authenticateToken, OrganizerLimited, updateEvent);
route.delete('/remove/:eventSlug', authenticateToken, OrganizerLimited, deleteEvent);
/** This section is only for /get function */
route.get('/get', getAllEvents);
route.get('/getby/slug/:eventSlug', getEventBySlug);
route.get('/getby/loggedUser', authenticateToken, OrganizerLimited, getOrganizerEvent);

/**
 * Will create a new Event
 * @param req
 * @param res
 * @returns True (event created) or False (error)
 */
export async function createEvent(req: Request, res: Response) {
  try {
    /** Get data from body */
    const data = req.body;
    /** Check if this event already exists */
    const alreadyExist = await EventModel.findOne({ slug: slugify(data.title) });
    if (alreadyExist) return res.status(400).json({ success: false, error: 'Event name already existing' });
    /** Creating new event */
    await EventModel.create({ ...data, slug: slugify(data.title), created_by: req!.user!.email });
    /** Return created event for feed-back */
    return res.status(201).json({ success: true });
  } catch (err) {
    /** Log error in console */
    console.error('CREATE EVENT ERROR =>', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Failed to create new event. Please try again.' });
  }
}

/**
 * This function is used to update event
 * @param req
 * @param res
 * @returns
 */
export async function updateEvent(req: Request, res: Response) {
  try {
    /** Get the evbnt slug from params */
    const { eventSlug } = req.params;
    /** Get new event data from body */
    const data = req.body;
    /** Check if the user is creator of the event and have the correct permission to delete */
    return res.status(500).json({ success: false });
    /** Need check if this event has already same propierties */
    return res.status(500).json({ success: false });
    /** Find and update the correct event */
    await EventModel.findOneAndUpdate({ slug: eventSlug }, data);
    /** Return successful updated event */
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('UPDATE EVENT ERROR =>', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

/**
 * This function remove specified event by the unique slug
 * @param req
 * @param res
 * @returns
 */
export async function deleteEvent(req: Request, res: Response) {
  try {
    /** Get paramas from delete request */
    const { eventSlug } = req.params;
    /** Check if this event exists */
    const alreadyExist = await EventModel.findOne({ slug: eventSlug });
    if (!alreadyExist) return res.status(400).json({ success: false, error: 'Event doesnt existing' });
    /** Find & delete the specified event */
    await EventModel.findOneAndDelete({ slug: eventSlug });
    /** Return success operation */
    return res.status(200).json({ success: true });
  } catch (err) {
    /** Log in console error */
    console.error('DELETE EVENT ERROR =>', err);
    /** Return error to the client */
    return res.status(500).json({ success: false, error: 'Delete event unsucessful' });
  }
}

export default route;
