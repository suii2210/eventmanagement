import type { Booking, CreateEventInput, Event } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface EventsResponse {
  events: Event[];
}

export interface BookingResponse {
  message: string;
  booking: Booking;
  event: Event;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch (error) {
      console.error('Failed to parse error response:', error);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const authAPI = {
  async signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    return handleResponse<AuthResponse>(response);
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse<AuthResponse>(response);
  },

  async signOut(token: string): Promise<void> {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const eventsAPI = {
  async getEvents(params?: { search?: string; location?: string; category?: string }): Promise<Event[]> {
    const url = new URL(`${API_URL}/events`);
    if (params?.search && params.search.trim()) {
      url.searchParams.set('search', params.search.trim());
    }
    if (params?.location && params.location.trim()) {
      url.searchParams.set('location', params.location.trim());
    }
    if (params?.category && params.category.trim()) {
      url.searchParams.set('category', params.category.trim());
    }

    const response = await fetch(url.toString());
    const data = await handleResponse<EventsResponse>(response);
    return data.events;
  },

  async createEvent(event: CreateEventInput, token: string): Promise<Event> {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    return handleResponse<Event>(response);
  },

  async bookEvent(eventId: string, quantity: number, token: string): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/events/${eventId}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    return handleResponse<BookingResponse>(response);
  },
};
