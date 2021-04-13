import axios from "axios"

const instance = axios.create({
  headers:{
    'Access-Control-Allow-Origin' : 'http://127.0.0.1:6789',
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  }
})

export default instance;