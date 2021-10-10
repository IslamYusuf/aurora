import express from "express";
import expressAsyncHandler from "express-async-handler";

import { getMpesaAccessToken, isAuth, verifyOrder, initiateStk } from "../utils.js";
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

const paymentRouter = express.Router();

paymentRouter.post('/mpesa/:id/pay', 
    isAuth,
    verifyOrder,
    getMpesaAccessToken,
    initiateStk,
    expressAsyncHandler(async (req, res)=>{
        if(req.mpesaResponseCode === 0){
            //TODO: save the 'MerchantRequestID' in the Order that made the payment request
            //const order = await Order.findById(req.params.id)
            req.order.mpesaInfo.mpesaMerchantRequestId = req.mpesaMerchantRequestId;
            req.order.mpesaInfo.mpesaCustomerMessage = req.mpesaCustomerMessage;
            req.order.mpesaInfo.isPayInProgress = true;

            const updatedOrder = await req.order.save();

            res.status(200).send(updatedOrder)
        } else {
            res.status(404).send({message: req.mpesaResponseDescription});
        }
    })    
)

paymentRouter.post('/mpesa/callback', expressAsyncHandler(async (req,_) =>{
    if(req.body.ResultCode === 0){
        const order = await Order.find({
            mpesaInfo: {
                mpesaMerchantRequestId: req.body.MerchantRequestID,
            },
        });
        if(order){
            const user = User.findById(order.user);

            order.isPaid = true
            order.paidAt = req.body.TransactionDate || Date.now()
            order.paymentResult = {
                id: req.body.MpesaReceiptNumber,
                status: true,
                updateTime: req.body.TransactionDate,
                emailAddress: user && user.email, //Todo: Fix email address
            }
            order.mpesaInfo.isPayInProgress = false;

            const updatedOrder = await order.save();
            console.log(updatedOrder);
        }
    } else {
        const order = await Order.find({
            mpesaInfo: {
                mpesaMerchantRequestId: req.body.MerchantRequestID,
            },
        });
        if(order){
            order.paymentResult = {status: false,}
            order.mpesaInfo.isPayInProgress = false;
            const updatedOrder = await order.save();

            console.log(updatedOrder);
        }
        console.log("Mpesa Payment failed.")
    }
}))

paymentRouter.put('/stripe/:id/pay', isAuth, expressAsyncHandler(async (req, res) =>{
    const order = await Order.findById(req.params.id);
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: true,
            updateTime: req.body.created,
            emailAddress: req.user.email,
        }

        const updatedOrder = await order.save();
        res.send({message: 'Order Paid', order: updatedOrder})
    } else {
        res.status(404).send({message: 'Order Not Found'})
    }
}))

export default paymentRouter;
