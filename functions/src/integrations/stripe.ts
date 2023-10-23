import functions = require('firebase-functions');
import axios from 'axios';

// Define the base URL of your backend API
const baseURL = 'https://api.stripe.com/v1/';

// Create an Axios instance with custom configuration
export const stripeApi = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${functions.config().stripe.api_key}`,
  },
});

// Define an interface for your API response data
export interface ApiResponse<T> {
  data: T;
}
