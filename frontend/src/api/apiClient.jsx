import applyCaseMiddleware from 'axios-case-converter'
import axios from 'axios'


// API通信を行うためのクライアント設定
const options = {
    ignoreHeaders: true,
}

const client = applyCaseMiddleware(
    axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
    }),
    options
);

export default client;