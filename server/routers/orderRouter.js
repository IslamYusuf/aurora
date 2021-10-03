import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Stripe from 'stripe';

import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModels.js';
import { isAuth, isAdmin } from '../utils.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const orderRouter = express.Router();

orderRouter.get('/summary',isAuth,isAdmin,
    expressAsyncHandler(async (req, res) => {
      const orders = await Order.aggregate([
        {
          $group: {
            _id: null,
            numOrders: { $sum: 1 },
            totalSales: { $sum: '$totalPrice' },
          },
        },
      ]);
      const users = await User.aggregate([
        {
          $group: {
            _id: null,
            numUsers: { $sum: 1 },
          },
        },
      ]);
      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const productCategories = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]);
      res.send({ users, orders, dailyOrders, productCategories });
    })
  );


orderRouter.get('/list', isAuth, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
}));

orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) =>{
    if(!req.body.orderItems.length){
        res.status(404).send({message: 'Cart is Empty'});
    } else {
      //const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      let customer
      const user = await User.findById(req.user._id);
      if(!user.hasStripeAccount){
        customer = await stripe.customers.create({
          description: 'My First Test Customer (created for API docs)',
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          address: {
            city: req.body.shippingAddress.city,
            country: req.body.shippingAddress.country,
            postal_code: req.body.shippingAddress.postalCode,
          },
          shipping:{
            address: {
              city: req.body.shippingAddress.city,
              country: req.body.shippingAddress.country,
              postal_code: req.body.shippingAddress.postalCode,
            },
            name: `${user.firstName} ${user.lastName}`, 
          },
        },
        {
          apiKey: process.env.STRIPE_SECRET_KEY,
        });

        user.hasStripeAccount = true;
        await user.save();
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: `${req.body.totalPrice * 100}`,
        currency: 'kes',
        customer: customer.id,
        //customer: req.body.shippingAddress.fullName,
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      });
      

        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
            clientSecret: paymentIntent.client_secret,
        });

        const createdOrder = await order.save();
        res.status(201).send({message: 'New Order Created', order: createdOrder, paymentIntent});
    }
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        res.send(order)
    } else {
        res.status(404).send({message: 'Order not Found.'})
    }
}))

orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({});
    res.send(orders)
}))

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) =>{
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

orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        const deletedOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deletedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
);

orderRouter.put('/:id/deliver',isAuth,isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.deliveredAt = Date.now();
        order.isDelivered = true;
  
        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
);



export default orderRouter;