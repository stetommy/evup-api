import { Request, Response } from 'express';
import EventModel from '../../../models/event/event.model';

/**
 * Return all public events. It works also if user is not loggen in.
 * Next to implement it's filtered return not all data,
 * meno carico sul db e dati da rasferire invece l'interezza dei dati
 * verràa mandata con la richiesta di uno specifico evento con il suo slug
 * @param req
 * @param res
 * @returns
 */
export async function getAllEvents(req: Request, res: Response) {
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

/**
 * This function return all Event created by an Organizer
 * @param req 
 * @param res 
 * @returns 
 */
export async function getOrganizerEvent(req: Request, res: Response) {
  try {
    const userEvent = await EventModel.find({createdby: req.params.userEmail})
    return res.status(200).json(userEvent);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
