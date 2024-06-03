import express from 'express';
import loadEnv from '../../services/env';
import { Request, Response } from 'express';
import EventModel from '../../models/event/event.model';
import authenticateToken from '../../middlewares/authenticate-token';
import { OrganizerLimited } from '../../middlewares/limited-access';

/** Router definition */
const route = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = loadEnv();

/**
 * Routes definitions
 */
route.post('/create', authenticateToken, OrganizerLimited, createEvent);
route.put('/update/:eventSlug', authenticateToken, OrganizerLimited, updateEvent);
route.delete('/delete/:eventSlug', authenticateToken, OrganizerLimited, deleteEvent);
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
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const event = new EventModel({
      ...req.body,
      organizer: req.user._id,
    });
    const savedEvent = await event.save();
    return res.status(201).json(savedEvent);
  } catch (err) {
    console.error('CREATE EVENT ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const updatedEvent = await EventModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json(updatedEvent);
  } catch (err) {
    console.error('UPDATE EVENT ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const deletedEvent = await EventModel.findByIdAndDelete(id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('DELETE EVENT ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function getEvents(req: Request, res: Response) {
  try {
    const events = await EventModel.find();
    return res.status(200).json(events);
  } catch (err) {
    console.error('GET EVENTS ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function getEventBySlug(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const event = await EventModel.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json(event);
  } catch (err) {
    console.error('GET EVENT BY ID ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export default route;
