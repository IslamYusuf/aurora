import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Stripe from 'stripe';

import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModels.js';
import { isAuth, isAdmin } from '../utils.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const orderRouter = express.Router()

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
      if(req.body.paymentMethod === 'Stripe'){
        const user = await User.findById(req.user._id);
        if(!user.stripeInfo.hasStripeAccount){
          const customer = await stripe.customers.create({
            description: 'BinAthman Test Customer.',
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

          user.stripeInfo.hasStripeAccount = true;
          user.stripeInfo.customerId = customer.id;
          await user.save();
        }

        const paymentIntent = await stripe.paymentIntents.create({ //req.body.totalPrice * 100
          amount: `${req.body.totalPrice}`.split('.').join(''), //parseInt((`${req.body.totalPrice}`.split('.').join('') + '00'))
          currency: 'kes',
          customer: user.stripeInfo.customerId,
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
            stripeInfo: {
              clientSecret: paymentIntent.client_secret
            },
            //clientSecret: paymentIntent.client_secret,
        });

        const createdOrder = await order.save();
        res.status(201).send({message: 'New Order Created', order: createdOrder, paymentIntent});
      } else{
        //Todo: Implement payment using mpesa
        const order = new Order({
          orderItems: req.body.orderItems,
          shippingAddress: req.body.shippingAddress,
          paymentMethod: req.body.paymentMethod,
          itemsPrice: req.body.itemsPrice,
          shippingPrice: req.body.shippingPrice,
          taxPrice: req.body.taxPrice,
          totalPrice: req.body.totalPrice,
          user: req.user._id,
        });

        const createdOrder = await order.save();
        res.status(201).send({message: 'New Order Created', order: createdOrder,});
      }
    }
}));

//Update Payment method of an Order
orderRouter.put(
    '/updatePaymentMethod/:id',
    isAuth,
    expressAsyncHandler(async (req, res) =>{
      console.log(`Starting the update process. orderID: ${req.params.id}`)
      const order = await Order.findById(req.params.id);
      if(order){
        //console.log(`Order Found: ${order}. PaymentMethod: ${order.paymentMethod}`)
        if(order.paymentMethod === 'Stripe'){
          //Todo: Change payment method to Mpesa
          order.paymentMethod = 'Mpesa';

          const updatedOrder = await order.save();
          res.status(201).send({message: 'Order Updated', order: updatedOrder});
        }else{
          console.log(`Working on stripe. UserID: ${order.user}`)
          //Todo: Change payment to Stripe
          const user = await User.findById(order.user);
          if(user){
            console.log(`User Found: ${user}`)
            if(!user.stripeInfo.hasStripeAccount){
              console.log(`User doesnt have a stripe account`)
              const customer = await stripe.customers.create({
                description: 'BinAthman Test Customer.',
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                address: {
                  city: order.shippingAddress.city,
                  country: order.shippingAddress.country,
                  postal_code: order.shippingAddress.postalCode,
                },
                shipping:{
                  address: {
                    city: order.shippingAddress.city,
                    country: order.shippingAddress.country,
                    postal_code: order.shippingAddress.postalCode,
                  },
                  name: `${user.firstName} ${user.lastName}`, 
                },
              },
              {
                apiKey: process.env.STRIPE_SECRET_KEY,
              });
    
              user.stripeInfo.hasStripeAccount = true;
              user.stripeInfo.customerId = customer.id;
              await user.save();
              console.log(`User after creating a Stripe Account.`)
            }
            //Todo: If order doesn't have a payment intent create one.
            //console.log(`Order has StripeInfo: ${!order.stripeInfo && order.stripeInfo.clientSecret}`)
            console.log(`is there Client Secret: ${typeof order.stripeInfo.clientSecret === 'undefined'}`)
            if(typeof order.stripeInfo.clientSecret === 'undefined'){ //order.stripeInfo && order.stripeInfo.clientSecret
              console.log(`Inside creating a stripe Intent.`)
              const paymentIntent = await stripe.paymentIntents.create({ //req.body.totalPrice * 100
                amount: `${order.totalPrice}`.split('.').join(''), //parseInt((`${req.body.totalPrice}`.split('.').join('') + '00'))
                currency: 'kes',
                customer: user.stripeInfo.customerId,
                // Verify your integration in this guide by including this parameter
                metadata: {integration_check: 'accept_a_payment'},
              },
              {
                apiKey: process.env.STRIPE_SECRET_KEY,
              });

              order.stripeInfo.clientSecret = paymentIntent.client_secret;
              order.paymentMethod = 'Stripe';
      
              const updatedOrder = await order.save();
              console.log(`Order after creating stripeIntent: ${updatedOrder}`)
              res.status(201).send({message: 'Order Updated', order: updatedOrder});

            } else{
              //Todo: change payment method to stripe if their is clientSecret in stripeInfo
              order.paymentMethod = 'Stripe';
      
              const updatedOrder = await order.save();
              res.status(201).send({message: 'Order Updated', order: updatedOrder});

            }
          } else{
            // Todo: Send error response to indicate user is not found 
            res.status(404).send({message: 'The user account/owner of the Order not Found.'})  
          }  
        }
      } else {
          res.status(404).send({message: 'Order not Found.'})
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