import axios from 'axios';

// Create an Axios instance with the API URL from environment variables
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This reads from the .env file
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});
  
export default axiosInstance;
