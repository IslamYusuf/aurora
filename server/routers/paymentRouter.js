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
        console.log(`sent an stkpush`)
        console.log(req.mpesaResponseCode)
        if(req.mpesaResponseCode == 0){
            console.log('Inside stkpush response')
            //const order = await Order.findById(req.params.id)
            req.order.mpesaInfo.mpesaMerchantRequestId = req.mpesaMerchantRequestId;
            req.order.mpesaInfo.mpesaCustomerMessage = req.mpesaCustomerMessage;
            req.order.mpesaInfo.isPayInProgress = true;

            const updatedOrder = await req.order.save();
            if(updatedOrder) console.log(`updatedOrder: ${updatedOrder}`)
            res.status(200).send(updatedOrder)
        } else {
            console.log('Stk response failed')
            res.status(404).send({message: req.mpesaResponseDescription});
        }
    })
)

paymentRouter.post('/mpesa/callback', expressAsyncHandler(async (req,res) =>{
    console.log('Inside mpesa callback')
    const result = req.body.Body;

    if(result.stkCallback.ResultCode === 0){
        console.log(`INSIDE SUCCESFUL MPESA PAYMENT`)
        const orderResult = await Order.find({"mpesaInfo.mpesaMerchantRequestId" : `${result.stkCallback.MerchantRequestID}`})
        const order = orderResult[0]
        
        try {
            if(order){
                console.log(`Inside Order success mpesa Pay.${order}`)
                console.log(`Inside Order success mpesa Pay. UserID.${order.user}`)
                const user = await User.findById(order.user);
                console.log(`Inside Order success mpesa Pay. User: ${user}`)
                console.log(`Inside Order success mpesa Pay. Result: ${result}`)
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
                console.log(` MPESA PAYMENT SUCCESS:${updatedOrder}`);
            }
        } catch (error) {
            console.log(`Succesful Mpesa Payment Error: ${error}`)
        }

    } else {
        const orderResult = await Order.find({"mpesaInfo.mpesaMerchantRequestId" : `${result.stkCallback.MerchantRequestID}`})
        const order = orderResult[0]

        if(order){
            order.paymentResult.status = false
            order.mpesaInfo.isPayInProgress = false;
            order.mpesaInfo.mpesaCustomerMessage = result.stkCallback.ResultDesc;
            
            /* order.mpesaInfo = {
                isPayInProgress: false,
                mpesaCustomerMessage:result.stkCallback.ResultDesc, 
            } */

            const updatedOrder = await order.save();
            console.log(`Mpesa Payment Failed. ${updatedOrder}`)
        }
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
