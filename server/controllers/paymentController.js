import axios from 'axios';
import datetime from 'node-datetime';
import ngrok from 'ngrok';

import User from '../models/userModel.js'
import Order from '../models/orderModel.js';

export const verifyOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        req.order = order;
        next();
    } else {
        res.status(401).send({ message: 'Order Not Found' })
    }
}

export const getMpesaAccessToken = async (req, res, next) => {
    try {
        const { data } = await axios.get(process.env.OAUTH_TOKEN_URL, {
            headers: {
                Authorization: `Basic ${process.env.OAUTH_TOKEN}`,
            },
        })

        req.mpesaOauthToken = data.access_token;
        next()
    } catch (error) {
        res.status(401).send({ message: `Error Retrieving Mpesa Token. ${error}` });
    }
}

export const initiateStk = async (req, res, next) => {
    try {
        const ngrokUrl = await ngrok.connect({
            authtoken: process.env.NGROK_AUTH_TOKEN, addr: 5000,
        });
        const timestamp = datetime.create().format('YmdHMS')
        const password =
            Buffer.from(`${process.env.SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString('base64')

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
            AccountReference: 'Aurora', //max characters 12 
            TransactionDesc: 'Test Payment1', //max characters 13
        });
        // send response to safaricom
        const { data } = await axios.post(process.env.STKPUSH_URL, body, {
            headers: {
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
        res.status(401).send({
            message: `Mpesa stkPush payment Failed. ${e}`,
        });
    }
}

export const initiateMpesaPayment = async (req, res) => {
    if (req.mpesaResponseCode == 0) {
        //const order = await Order.findById(req.params.id)
        req.order.mpesaInfo.mpesaMerchantRequestId = req.mpesaMerchantRequestId;
        req.order.mpesaInfo.mpesaCustomerMessage = req.mpesaCustomerMessage;
        req.order.mpesaInfo.isPayInProgress = true;

        const updatedOrder = await req.order.save();
        if (updatedOrder) console.log(`updatedOrder: ${updatedOrder}`)
        res.status(200).send(updatedOrder)
    } else {
        console.log('Stk response failed')
        res.status(404).send({ message: req.mpesaResponseDescription });
    }
}

export const confirmMpesaPayment = async (req, res) => {
    const result = req.body.Body;

    if (result.stkCallback.ResultCode === 0) {
        const orderResult = await Order.find({
            "mpesaInfo.mpesaMerchantRequestId": `${result.stkCallback.MerchantRequestID}`
        })
        const order = orderResult[0]

        try {
            if (order) {
                const user = await User.findById(order.user);
                //const callbackMetadataArray = result.CallbackMetadata.Item; 
                //console.log(`Inside Order success mpesa Pay. CallbackMetadatArray: ${callbackMetadataArray}`)
                //const resultInfo = callbackMetadataArray.filter(item => item.Name === 'MpesaReceiptNumber')
                //console.log(`Inside Order success mpesa Pay. ResultInfo: ${resultInfo}`)
                //const mpesaReceiptNumber = resultInfo[0]
                //console.log(`Inside Order success mpesa Pay. MpesaRecieptNumber: ${mpesaReceiptNumber}`)

                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    //id: mpesaReceiptNumber.value,
                    status: true,
                    updateTime: Date.now(),
                    emailAddress: user && user.email,
                }
                order.mpesaInfo.isPayInProgress = false;
                order.mpesaInfo.mpesaCustomerMessage = result.stkCallback.ResultDesc;

                const updatedOrder = await order.save();
            }
        } catch (error) {
            console.log(`Succesful Mpesa Payment Error: ${error}`)
        }

    } else {
        const orderResult = await Order.find({
            "mpesaInfo.mpesaMerchantRequestId": `${result.stkCallback.MerchantRequestID}`
        })
        const order = orderResult[0]

        if (order) {
            order.paymentResult.status = false
            order.mpesaInfo.isPayInProgress = false;
            order.mpesaInfo.mpesaCustomerMessage = result.stkCallback.ResultDesc;

            const updatedOrder = await order.save();
        }
    }
}

export const confirmStripePayment = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: true,
            updateTime: req.body.created,
            emailAddress: req.user.email,
        }

        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder })
    } else {
        res.status(404).send({ message: 'Order Not Found' })
    }
}