import express from "express";
import jwt from "jsonwebtoken";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import OpenAI from "openai"; // optional if you plan to use real AI

const router = express.Router();

// 🧩 Optional: initialize OpenAI (only if you plan to enable real AI generation)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * POST /api/events
 * Manual event creation (draft)
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, date, time, location, summary, category, startTime, endTime } = req.body;

    if (!title || !date || !location)
      return res.status(400).json({ error: "Please fill all required fields." });

    const event = new Event({
      title,
      description: description || "",
      summary: summary || "",
      category: category || "General",
      date,
      time,
      startTime,
      endTime,
      location,
      status: "draft", // Events start as drafts
      createdBy: req.user?._id || null,
    });

    await event.save();

    res.status(201).json({
      message: "✅ Event created successfully!",
      event,
    });
  } catch (error) {
    console.error("Error creating manual event:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/events/ai
 * AI-assisted event creation
 */
router.post("/ai", async (req, res) => {
  try {
    const { title, date, time, location } = req.body;

    if (!title)
      return res.status(400).json({ error: "Event title is required for AI generation." });

    let description = `An exciting event titled "${title}" happening at ${location || "a wonderful venue"} on ${date || "an upcoming date"} at ${time || "a convenient time"}. Don’t miss it!`;

    // 🧠 If OpenAI key is set, generate richer text automatically
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert event marketing writer. Write short, engaging, family-friendly event descriptions.",
          },
          {
            role: "user",
            content: `Write a 2–3 paragraph description for an event titled "${title}", at "${location}", happening on "${date}" at "${time}".`,
          },
        ],
      });
      description = completion.choices[0]?.message?.content?.trim() || description;
    }

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      createdBy: req.user?._id || null,
    });

    await event.save();

    res.status(201).json({
      message: openai ? "🤖 AI-generated event created!" : "AI event created with default text.",
      event,
    });
  } catch (error) {
    console.error("Error creating AI event:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/events
 * Fetch published events for public listing (only published events appear on website)
 */
router.get("/", async (req, res) => {
  try {
    const { search, location, category } = req.query;
    let query = { status: "published" }; // Only show published events on the public website
    
    // Build search conditions
    const searchConditions = [];
    
    // Add search functionality - maintain the published status requirement
    if (search && search.trim()) {
      searchConditions.push({
        $or: [
          { title: { $regex: search.trim(), $options: "i" } },
          { description: { $regex: search.trim(), $options: "i" } },
          { category: { $regex: search.trim(), $options: "i" } },
          { location: { $regex: search.trim(), $options: "i" } }
        ]
      });
    }
    
    // Add location filtering
    if (location && location.trim()) {
      searchConditions.push({
        location: { $regex: location.trim(), $options: "i" }
      });
    }
    
    // Add category filtering
    if (category && category.trim()) {
      searchConditions.push({
        category: { $regex: category.trim(), $options: "i" }
      });
    }
    
    // Combine all conditions
    if (searchConditions.length > 0) {
      query.$and = [
        { status: "published" },
        ...searchConditions
      ];
    }
    
    // Log the query for debugging
    console.log("Events query:", JSON.stringify(query, null, 2));

    // First, let's check if there are any events at all
    const totalEvents = await Event.countDocuments();
    console.log(`Total events in database: ${totalEvents}`);
    
    const publishedEvents = await Event.countDocuments({ status: "published" });
    console.log(`Published events in database: ${publishedEvents}`);

    const events = await Event.find(query)
      .populate('createdBy', 'full_name email')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${events.length} events matching query`);
    if (events.length > 0) {
      console.log('First event:', {
        id: events[0]._id,
        title: events[0].title,
        status: events[0].status,
        tickets: events[0].tickets?.length || 0
      });
    }
    
    // Transform events to match frontend expected format
    const transformedEvents = events.map(event => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      summary: event.summary,
      category: event.category || "General",
      location: event.location,
      image_url: event.image_url,
      start_date: event.date ? `${event.date}T${event.startTime || event.time || "00:00:00"}` : new Date().toISOString(),
      end_date: event.date ? `${event.date}T${event.endTime || event.time || "23:59:59"}` : new Date().toISOString(),
      ticket_price: event.tickets && event.tickets.length > 0 ? event.tickets[0].price : event.ticket_price || 0,
      total_tickets: event.tickets && event.tickets.length > 0 ? 
        event.tickets.reduce((total, ticket) => total + ticket.quantity, 0) : 
        event.total_tickets || 0,
      available_tickets: event.tickets && event.tickets.length > 0 ? 
        event.tickets.reduce((total, ticket) => total + (ticket.quantity - ticket.sold), 0) : 
        event.available_tickets || 0,
      organized_by: event.createdBy?.full_name || "Unknown",
      created_at: event.createdAt,
      updated_at: event.updatedAt,
      tickets: event.tickets || []
    }));

    res.json({ events: transformedEvents });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/events/:id/tickets
 * Add tickets to an event (before publishing)
 */
router.put("/:id/tickets", async (req, res) => {
  try {
    const { tickets } = req.body;
    
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: "Tickets array is required." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Validate tickets
    for (let ticket of tickets) {
      if (!ticket.name || ticket.price === undefined || ticket.quantity === undefined) {
        return res.status(400).json({ error: "Each ticket must have name, price, and quantity." });
      }
      if (ticket.quantity <= 0) {
        return res.status(400).json({ error: "Ticket quantity must be greater than 0." });
      }
    }

    event.tickets = tickets;
    // Update backward compatibility fields
    event.total_tickets = tickets.reduce((total, ticket) => total + ticket.quantity, 0);
    event.ticket_price = tickets.length > 0 ? tickets[0].price : 0;
    event.available_tickets = tickets.reduce((total, ticket) => total + ticket.quantity, 0);

    await event.save();

    res.json({
      message: "✅ Tickets added successfully!",
      event,
    });
  } catch (error) {
    console.error("Error adding tickets:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/events/:id/publish
 * Publish an event (make it visible on the website)
 */
router.put("/:id/publish", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.status === "published") {
      return res.status(400).json({ error: "Event is already published." });
    }

    if (!event.tickets || event.tickets.length === 0) {
      return res.status(400).json({ error: "Cannot publish event without tickets." });
    }

    event.status = "published";
    await event.save();

    res.json({
      message: "🎉 Event published successfully!",
      event,
    });
  } catch (error) {
    console.error("Error publishing event:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/events/:id
 * Get a specific event (for preview)
 */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'full_name email');
    
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/events/:id/bookings
 * Book tickets for an event
 */
router.post("/:id/bookings", async (req, res) => {
  try {
    const { quantity, ticketType } = req.body;
    const eventId = req.params.id;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Valid ticket quantity is required." });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (event.status !== "published") {
      return res.status(400).json({ error: "Event is not available for booking." });
    }

    // Find the ticket type (default to first ticket if not specified)
    let selectedTicket = event.tickets && event.tickets.length > 0 ? event.tickets[0] : null;
    if (ticketType && event.tickets) {
      selectedTicket = event.tickets.find(ticket => ticket.name === ticketType) || selectedTicket;
    }

    if (!selectedTicket) {
      return res.status(400).json({ error: "No tickets available for this event." });
    }

    // Check availability
    if (selectedTicket.sold + quantity > selectedTicket.quantity) {
      return res.status(400).json({ error: "Not enough tickets available." });
    }

    // Get user ID from authentication (token in header)
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required." });
    }

    let userId;
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    // Calculate total amount
    const totalAmount = selectedTicket.price * quantity;

    // Create booking
    const booking = new Booking({
      event_id: eventId,
      user_id: userId,
      quantity,
      total_amount: totalAmount,
      booking_status: "confirmed"
    });

    await booking.save();

    // Update ticket sold count
    selectedTicket.sold += quantity;
    await event.save();

    res.status(201).json({
      message: "✅ Tickets booked successfully!",
      booking: {
        id: booking.id,
        event_id: booking.event_id,
        user_id: booking.user_id,
        quantity: booking.quantity,
        total_amount: booking.total_amount,
        booking_status: booking.booking_status,
        created_at: booking.created_at,
        updated_at: booking.updated_at
      },
      event: {
        ...event.toObject(),
        available_tickets: event.tickets ? event.tickets.reduce((total, ticket) => total + (ticket.quantity - ticket.sold), 0) : 0
      }
    });
  } catch (error) {
    console.error("Error booking tickets:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
