import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const client_supabase = createClient("https://ndqagisnniwkpgcgitfo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcWFnaXNubml3a3BnY2dpdGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1MDg1NDEsImV4cCI6MjAyMTA4NDU0MX0.t20HE-l2gTRgHV4tcggg0sGXbfVDg-7psKfrH3TFdM0");
export default client_supabase