import applyCaseMiddleware from 'axios-case-converter'
import axios, { AxiosInstance } from 'axios';

// API通信を行うためのクライアント設定
interface Options {
    ignoreHeaders: boolean;
}

const options: Options = {
    ignoreHeaders: true,
}

const client: AxiosInstance = applyCaseMiddleware(
    axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
    }),
    options
);

export default client;