import jwt from 'jsonwebtoken';
import axios from 'axios';
import datetime from 'node-datetime';
import ngrok from 'ngrok';

import Order from './models/orderModel.js';

/* const url = await ngrok.connect({authtoken: process.env.NGROK_AUTH_TOKEN, addr: 5000,});
console.log(url) */

export const generateToken = (user) =>{
    return jwt.sign({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        isAdmin: user.isAdmin}, process.env.JWT_SECRET  || 'securekey', {
            expiresIn: '30d',
        })
}

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'securekey', (err, decode) => {
            if(err) res.status(401).send({message: 'Invalid Token'})
            else {
                req.user = decode;
                next();
            }
        })
    } else {
        res.status(401).send({message: 'No Token'});
    }
}

export const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    } else {
        res.status(401).send({message: 'Invalid Admin Token'});
    }
}

export const verifyOrder = async (req, res, next) =>{
    console.log(`inside order verification`)
    const order = await Order.findById(req.params.id);
    if(order){
        req.order = order;
        console.log(`order is verified`)
        next();
    } else {
        res.status(401).send({ message: 'Order Not Found'})
    }
}

export const getMpesaAccessToken = async (req, res, next) =>{
    try {
        console.log(`getting mpesa token`)
        const {data} = await axios.get(process.env.OAUTH_TOKEN_URL,{
            headers:{
                Authorization: `Basic ${process.env.OAUTH_TOKEN}`,
            },
        })

        req.mpesaOauthToken = data.access_token;
        next()
    } catch (error) {
        res.status(401).send({message: `Error Retrieving Mpesa Token. ${error}`});    
    }
}

export const initiateStk = async (req,res,next) =>{
    try {
        const ngrokUrl = await ngrok.connect({authtoken: process.env.NGROK_AUTH_TOKEN, addr: 5000,});
        const timestamp = datetime.create().format('YmdHMS')
        const password = Buffer.from(`${process.env.SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString('base64')

        const formattedAmount = (req.order.totalPrice).toString().split('.')[0] 

        const body = JSON.stringify({
          BusinessShortCode: process.env.SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: formattedAmount || 1,
          PartyA: req.body.mpesaPhoneNumber,
          PartyB: process.env.SHORT_CODE,
          PhoneNumber: req.body.mpesaPhoneNumber,
          CallBackURL: `${ngrokUrl}/api/payment/mpesa/callback`,
          AccountReference: 'Bin-Athman E-Store( islam Yusuf Project)',
          TransactionDesc: 'Payment for goods purchased',
        });
        // send response to safaricom
        const {data} = await axios.post(process.env.STKPUSH_URL, body, {
            headers:{
                "Authorization": `Bearer ${req.mpesaOauthToken}`,
                "Content-type": 'application/json',
            },
        });
        
        req.mpesaMerchantRequestId = data.MerchantRequestID;
        req.mpesaResponseCode = data.ResponseCode;
        req.mpesaCustomerMessage = data.CustomerMessage;
        req.mpesaResponseDescription = data.ResponseDescription;
        next()
      } catch (e) {
        res.status(401).send({message: `Mpesa stkPush payment Failed. ${e}`, });
      }
}