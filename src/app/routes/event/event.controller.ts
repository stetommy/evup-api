import { Response } from 'express';
import EventModel from '../../models/event/event.model';
import { AuthenticatedRequest } from '../../middlewares/event/authenticated-request';

export async function createEvent(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const event = new EventModel({
      ...req.body,
      organizer: req.user._id
    });
    const savedEvent = await event.save();
    return res.status(201).json(savedEvent);
  } catch (err) {
    console.error('CREATE EVENT ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function updateEvent(req: AuthenticatedRequest, res: Response) {
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

export async function deleteEvent(req: AuthenticatedRequest, res: Response) {
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

export async function getEvents(req: AuthenticatedRequest, res: Response) {
  try {
    const events = await EventModel.find();
    return res.status(200).json(events);
  } catch (err) {
    console.error('GET EVENTS ERROR =>', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export async function getEventById(req: AuthenticatedRequest, res: Response) {
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
