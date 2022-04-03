import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import { isAuth, isAdmin } from '../utils.js';
import {
  getAllOrders, getOrder, getOrders, getUserOrders,
  createOrder, updatePaymentMethod, saveOrderPayment,
  deleteOrder, deliverOrder
} from '../controllers/orderController.js'

const orderRouter = express.Router()

orderRouter.get('/summary', isAuth, isAdmin,
  expressAsyncHandler(getAllOrders)
);

orderRouter.get('/list', isAuth,
  expressAsyncHandler(getUserOrders));

orderRouter.post('/', isAuth,
  expressAsyncHandler(createOrder));

orderRouter.put('/updatePaymentMethod/:id', isAuth,
  expressAsyncHandler(updatePaymentMethod));

orderRouter.get('/:id', isAuth,
  expressAsyncHandler(getOrder))

orderRouter.get('/', isAuth, isAdmin,
  expressAsyncHandler(getOrders))

orderRouter.put('/:id/pay', isAuth,
  expressAsyncHandler(saveOrderPayment))

orderRouter.delete('/:id', isAuth, isAdmin,
  expressAsyncHandler(deleteOrder)
);

orderRouter.put('/:id/deliver', isAuth, isAdmin,
  expressAsyncHandler(deliverOrder)
);

export default orderRouter;