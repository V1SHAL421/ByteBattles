import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

// Retrieve supabase URL and key from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log(`The supabase URL is ${supabaseUrl} and the supabase key is ${supabaseKey}`)

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase