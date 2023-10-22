import axios from 'axios';

// Define the base URL of your backend API
const baseURL = import.meta.env.VITE_API_URL;

// Create an Axios instance with custom configuration
export const api = axios.create({
  baseURL,
});

// Define an interface for your API response data
export interface ApiResponse<T> {
  data: T;
}
