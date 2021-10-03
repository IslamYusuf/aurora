import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import axios from 'axios';

const mpesaRouter = express.Router();

mpesaRouter.get('/', expressAsyncHandler((req, res) =>{
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    
    axios.get(url, {
        headers: {
            Authorization: `Basic TUdTR2tRYk9Qd29rU0YxR1JDdkFrdHVXUEx5Y2thTkI6NDd5MDlOVEZHQWNhbmx0bQ==`
        }
    }).then(({data}) => res.send(data.access_token)).catch(e => console.log(e.message))
}));

export default mpesaRouter;