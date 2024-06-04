import express from 'express';
import loadEnv from '../../services/env';
import { Request, Response } from 'express';
import EventModel from '../../models/event/event.model';
import authenticateToken from '../../middlewares/authenticate-token';
import { OrganizerLimited } from '../../middlewares/limited-access';
import slugify from 'slugify';

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
route.get('/get', getEvents);
route.get('/getby/:eventSlug', getEventBySlug);

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
    await EventModel.create({ ...data, slug: slugify(data.title) });
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

/**
 * Return all public events. It works also if user is not loggen in. Next to implement it's filtered return not all data, meno carico sul db e dati da rasferire invece l'interezza dei dati verràa mandata con la richiesta di uno specifico evento con il suo slug
 * @param req
 * @param res
 * @returns
 */
export async function getEvents(req: Request, res: Response) {
  try {
    /** Find all events in DB */
    const events = await EventModel.find();
    /** Return the event object */
    return res.status(200).json(events);
  } catch (err) {
    /** Log error */
    console.error('GET EVENTS ERROR =>', err);
    /** Return error */
    return res.status(500).json({ success: false, error: 'Get events error. Please try again' });
  }
}

/**
 * This funciton retunr specific event by slug search, all data of the specified event
 * @param req
 * @param res
 * @returns
 */
export async function getEventBySlug(req: Request, res: Response) {
  try {
    /** Get slug from the request params */
    const { eventSlug } = req.params;
    /** Serach the specific event in db */
    const event = await EventModel.findOne({ slug: eventSlug });
    /** If this event not exist return error */
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    /** elese return the finded event */
    return res.status(200).json(event);
  } catch (err) {
    /** Log in console the catchaded error */
    console.error('GET EVENT BY ID ERROR =>', err);
    /** Return the cathed error */
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

export default route;
