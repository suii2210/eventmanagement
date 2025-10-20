import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserType = 'organizer' | 'attendee';

export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  created_at: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  image_url: string;
  start_date: string;
  end_date: string;
  ticket_price: number;
  total_tickets: number;
  available_tickets: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  event_id: string;
  user_id: string;
  quantity: number;
  total_amount: number;
  booking_status: 'confirmed' | 'cancelled';
  created_at: string;
}
