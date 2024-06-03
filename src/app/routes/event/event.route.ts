import express from 'express';
import { createEvent, updateEvent, deleteEvent, getEvents, getEventById } from './event.controller';
import { authenticateOrganizer } from '../../middlewares/event/authenticate-organizer';
import { Router } from 'express';


const eventRouter = Router();

eventRouter.post('/public', authenticateOrganizer, createEvent);
eventRouter.put('/:id', authenticateOrganizer, updateEvent);
eventRouter.delete('/:id', authenticateOrganizer, deleteEvent);
eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEventById);

export default eventRouter;