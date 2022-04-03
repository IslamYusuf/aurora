import express from "express";
import expressAsyncHandler from "express-async-handler";

import { isAuth } from "../utils.js";

import {
    verifyOrder, getMpesaAccessToken, initiateStk,
    initiateMpesaPayment, confirmMpesaPayment,
    confirmStripePayment
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post('/mpesa/:id/pay', isAuth,
    verifyOrder, getMpesaAccessToken, initiateStk,
    expressAsyncHandler(initiateMpesaPayment))

paymentRouter.post('/mpesa/callback',
    expressAsyncHandler(confirmMpesaPayment))

paymentRouter.put('/stripe/:id/pay', isAuth,
    expressAsyncHandler(confirmStripePayment))

export default paymentRouter;
