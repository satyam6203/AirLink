import axios from 'axios';

// const localHost="http://localhost:5000"
// const vpsIP="http://194.164.148.89:5000"
const deployed="https://codewithzosh.tech"

const api = axios.create({
  baseURL: deployed,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

