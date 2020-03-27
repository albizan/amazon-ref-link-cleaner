import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.rebrandly.com/v1/links',
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
    apikey: process.env.SHORTNER_API_KEY,
  },
});
