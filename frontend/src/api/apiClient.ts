import applyCaseMiddleware from 'axios-case-converter'
import axios, { AxiosInstance } from 'axios';

// API通信を行うためのクライアント設定
const client: AxiosInstance = applyCaseMiddleware(
    axios.create({
        baseURL: process.env.REACT_APP_BACK_BASE_URL,
    }),
);

export default client;