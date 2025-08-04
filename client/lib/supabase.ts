import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      investors: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'vc' | 'angel' | 'incubator' | 'accelerator' | 'family_office' | 'corporate' | 'government' | 'other';
          email: string;
          phone?: string;
          website?: string;
          contact_person?: string;
          location?: string;
          investment_focus: string[];
          stage_preference: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'any';
          ticket_size_min?: number;
          ticket_size_max?: number;
          ticket_size_currency?: 'USD' | 'INR' | 'EUR' | 'GBP';
          status: 'researching' | 'contacted' | 'application_submitted' | 'meeting_scheduled' | 'under_review' | 'rejected' | 'invested' | 'follow_up';
          notes?: string;
          next_action?: string;
          next_action_date?: string;
          tags?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'vc' | 'angel' | 'incubator' | 'accelerator' | 'family_office' | 'corporate' | 'government' | 'other';
          email: string;
          phone?: string;
          website?: string;
          contact_person?: string;
          location?: string;
          investment_focus: string[];
          stage_preference: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'any';
          ticket_size_min?: number;
          ticket_size_max?: number;
          ticket_size_currency?: 'USD' | 'INR' | 'EUR' | 'GBP';
          status: 'researching' | 'contacted' | 'application_submitted' | 'meeting_scheduled' | 'under_review' | 'rejected' | 'invested' | 'follow_up';
          notes?: string;
          next_action?: string;
          next_action_date?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'vc' | 'angel' | 'incubator' | 'accelerator' | 'family_office' | 'corporate' | 'government' | 'other';
          email?: string;
          phone?: string;
          website?: string;
          contact_person?: string;
          location?: string;
          investment_focus?: string[];
          stage_preference?: 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'any';
          ticket_size_min?: number;
          ticket_size_max?: number;
          ticket_size_currency?: 'USD' | 'INR' | 'EUR' | 'GBP';
          status?: 'researching' | 'contacted' | 'application_submitted' | 'meeting_scheduled' | 'under_review' | 'rejected' | 'invested' | 'follow_up';
          notes?: string;
          next_action?: string;
          next_action_date?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name?: string;
          company?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          company?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          company?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
