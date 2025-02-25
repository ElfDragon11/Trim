import { createClient } from '@supabase/supabase-js';

// Fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oyfcsmioaaqfjarfcipi.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZmNzbWlvYWFxZmphcmZjaXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MzExMTUsImV4cCI6MjA1NjAwNzExNX0.X8a10yca1S_gaAZHZV81z6HCUc8ryhcxzkv7szzLjck';

export const supabase = createClient(supabaseUrl, supabaseKey);