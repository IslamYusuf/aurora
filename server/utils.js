import jwt from 'jsonwebtoken';
import axios from 'axios';
import datetime from 'node-datetime';

import Order from './models/orderModel.js';

export const generateToken = (user) =>{
    return jwt.sign({
        _id: user._id,
        name: user.name,
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

export const verifyOrder = (req, res, next) => async() =>{
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            req.order = order;
            next();
        } 
    } catch (e) {
        res.status(401).send({ message: 'Order Not Found'})
    }
}

export const getMpesaAccessToken = (req, res, next) => async() =>{
    try {
        const {data} = await axios.get(process.env.OAUTH_TOKEN_URL,{
            headers:{
                Authorization: `Basic ${process.env.OAUTH_TOKEN}`,
            },
        })

        req.mpesaOauthToken = data.access_token;
        next()
    } catch (error) {
        res.status(401).send({message: 'Invalid OAuth Mpesa Token'});    
    }
}

export const initiateStk = (req,res,next) => async () => {
    try {
        const timestamp = datetime.create().format('YYYYmmddHHMMSS')
        const password = Buffer.from(`${process.env.SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString('base64')
        
        const body = JSON.stringify({
          BusinessShortCode: process.env.SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: req.order.totalPrice || 1,
          PartyA: req.body.mpesaPhoneNumber || process.env.PHONE_NUMBER,
          PartyB: process.env.SHORT_CODE,
          PhoneNumber: req.body.mpesaPhoneNumber || process.env.PHONE_NUMBER,
          CallBackURL: process.env.MPESA_CALLBACK_URL || '', //TODO: Need to set up a callback url
          AccountReference: 'Aurora E-Commerce Company',
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
        res.status(401).send({message: 'Mpesa stkPush payment Failed'});
      }
}