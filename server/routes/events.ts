import { Router } from 'express';
import Event from '../models/Event';
import Booking from '../models/Booking';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { search, location } = req.query as { search?: string; location?: string };
    const query = Event.find()
      .where('start_date')
      .gte(new Date())
      .where('available_tickets')
      .gt(0);

    if (search) {
      const regex = new RegExp(search, 'i');
      query.find({
        $or: [{ title: regex }, { description: regex }, { category: regex }],
      });
    }

    if (location) {
      query.find({ location: { $regex: location, $options: 'i' } });
    }

    const events = await query.sort({ start_date: 1 });

    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      image_url,
      start_date,
      end_date,
      ticket_price,
      total_tickets,
    } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!title || !description || !category || !location || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof ticket_price !== 'number' || typeof total_tickets !== 'number') {
      return res.status(400).json({ error: 'Invalid ticket price or total tickets' });
    }

    const event = new Event({
      organizer_id: req.user.userId,
      title,
      description,
      category,
      location,
      image_url,
      start_date,
      end_date,
      ticket_price,
      total_tickets,
      available_tickets: total_tickets,
    });

    await event.save();

    res.status(201).json(event.toJSON());
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.post('/:eventId/bookings', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { eventId } = req.params;
    const { quantity } = req.body as { quantity?: number };

    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.available_tickets < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    const booking = new Booking({
      event_id: event._id,
      user_id: req.user.userId,
      quantity,
      total_amount: event.ticket_price * quantity,
      booking_status: 'confirmed',
    });

    event.available_tickets -= quantity;

    await booking.save();
    await event.save();

    res.status(201).json({
      message: 'Booking confirmed',
      booking: booking.toJSON(),
      event: event.toJSON(),
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
