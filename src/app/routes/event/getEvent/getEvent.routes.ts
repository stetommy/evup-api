import { Request, Response } from 'express';
import EventModel from '../../../models/event/event.model';
import { IEvent } from '../../../models/event/event.model';

/**
 * Return all public events formatted with some important data to display in scroll page.
 * It works also if user is not loggen in.
 * @param req
 * @param res
 * @returns
 */
export async function getAllEvents(req: Request, res: Response) {
  try {
    /** Find all events in DB */
    const events = await EventModel.find();
    /** Handling the case where the course is not found */
    if (!events) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    /** Formatting events before sending */
    const formattedEvent = await Promise.all(
      events.map(async (events: IEvent) => {
        return {
          title: events.title,
          description: events.description,
          time_start: events.time_start,
          address: events.address,
        };
      }),
    );
    /** Return the event object */
    return res.status(200).json(formattedEvent);
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
    /** Return all the event of the user logged in if it's an organizer*/
    return res.status(200).json(await EventModel.find({ created_by: req!.user!.email }));
  } catch (err) {
    /** Console log the error occured */
    console.log('Get Organizer event ERROR => ', err);
    /** Return error to the client */
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
