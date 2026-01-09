import Constants from "expo-constants";
import { supabase } from '@/lib/supabase';

// Get the IP address of the machine running 'npx expo start'
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(":")[0];

export const API_URL = localhost 
  ? `http://${localhost}:8000` 
  : "https://api.your-production-url.com";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    // Ensure content-type is json if not set, and if body is present (imperfect check but useful)
    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
    }

    // Prepend API_URL if url is relative (starts with /)
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

    const response = await fetch(fullUrl, {
        ...options,
        headers,
    });

    return response;
}
