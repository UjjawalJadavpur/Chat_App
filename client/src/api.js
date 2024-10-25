import axios from 'axios'
import Cookies from 'js-cookie'

export const BASE_URL = 'http://localhost:5017/'

const api = axios.create({
    baseURL:BASE_URL
})

api.interceptors.request.use((config)=>{
    const token  =Cookies.get('jwt')
    // console.log("calling request config",token)
    if(token){
        config.headers.Authorization=`Bearer ${token}`
        // config.headers.withCredentials= true,
    }
    return config
})

export default api;