//import expressAsyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import util from 'util'

import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModels.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const checkStripeAccount = async (userId, order) => {
    const user = await User.findById(userId);

    if (!user.stripeInfo.hasStripeAccount) {
        const customer = await stripe.customers.create({
            description: 'Aurora Test Customer.',
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            address: {
                city: order.shippingAddress.city,
                country: order.shippingAddress.country,
                postal_code: order.shippingAddress.postalCode,
            },
            shipping: {
                address: {
                    city: order.shippingAddress.city,
                    country: order.shippingAddress.country,
                    postal_code: order.shippingAddress.postalCode,
                },
                name: `${user.firstName} ${user.lastName}`,
            },
        }, { apiKey: process.env.STRIPE_SECRET_KEY, });

        user.stripeInfo.hasStripeAccount = true;
        user.stripeInfo.customerId = customer.id;
        const updatedUser = await user.save();
        return updatedUser
    }
    return user;
}

const createStripePaymentIntent = async (userId, order) => {
    const user = await checkStripeAccount(userId, order)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100),
        currency: 'kes',
        customer: user.stripeInfo.customerId,
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' },
    }, { apiKey: process.env.STRIPE_SECRET_KEY, });

    return paymentIntent
}

const handleStripeOrder = async (res, userId, order) => {
    const paymentIntent = await createStripePaymentIntent(userId, order)

    const newOrder = new Order({
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
        user: userId,
        stripeInfo: {
            clientSecret: paymentIntent.client_secret
        },
    });

    const createdOrder = await newOrder.save();
    res.status(201).send({
        message: 'New Order Created',
        order: createdOrder, paymentIntent
    });
}

const handleMpesaOrder = async (res, userId, order) => {
    const newOrder = new Order({
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        itemsPrice: order.itemsPrice,
        shippingPrice: order.shippingPrice,
        taxPrice: order.taxPrice,
        totalPrice: order.totalPrice,
        user: userId,
    });

    const createdOrder = await newOrder.save();
    res.status(201).send({
        message: 'New Order Created', order: createdOrder,
    });
}

// Get All Orders
export const getAllOrders = async (req, res) => {
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
}

//Get all orders of a specific user
export const getUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
}

//Creating an order
export const createOrder = async (req, res) => {
    if (!req.body.orderItems.length) {
        res.status(404).send({ message: 'Cart is Empty' });
    } else {
        req.body.paymentMethod === 'Stripe'
            ? handleStripeOrder(res, req.user._id, req.body)
            : handleMpesaOrder(res, req.user._id, req.body)
    }
}

//Update Payment method of an Order
export const updatePaymentMethod = async (req, res) => {
    console.log(`Starting the update process. orderID: ${req.params.id}`)
    const order = await Order.findById(req.params.id);
    if (order) {
        if (order.paymentMethod === 'Stripe') {
            //Change payment method to Mpesa
            order.paymentMethod = 'Mpesa';

            const updatedOrder = await order.save();
            res.status(201).send({ message: 'Order Updated', order: updatedOrder });
        } else {
            console.log(`Working on stripe. UserID: ${order.user}`)
            //Change payment to Stripe
            const user = await User.findById(order.user);

            if (user) {
                //If order doesn't have a payment intent create one.
                console.log(`is there Client Secret: ${typeof order.stripeInfo.clientSecret === 'undefined'}`)
                if (typeof order.stripeInfo.clientSecret === 'undefined') { //order.stripeInfo && order.stripeInfo.clientSecret
                    console.log(`Inside creating a stripe Intent.`)
                    const paymentIntent = await createStripePaymentIntent(user._id, order)

                    order.stripeInfo.clientSecret = paymentIntent.client_secret;
                    order.paymentMethod = 'Stripe';

                    const updatedOrder = await order.save();
                    console.log(`Order after creating stripeIntent: ${updatedOrder}`)
                    res.status(201).send({ message: 'Order Updated', order: updatedOrder });
                } else {
                    //change payment method to stripe if their is clientSecret in stripeInfo
                    order.paymentMethod = 'Stripe';

                    const updatedOrder = await order.save();
                    res.status(201).send({ message: 'Order Updated', order: updatedOrder });
                }
            } else {
                //Send error response to indicate user is not found 
                res.status(404).send({ message: 'The user account/owner of the Order not Found.' })
            }
        }
    } else {
        res.status(404).send({ message: 'Order not Found.' })
    }
}

export const getOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) res.send(order)
    else {
        res.status(404).send({ message: 'Order not Found.' })
    }
}

export const getOrders = async (req, res) => {
    const orders = await Order.find({});
    res.send(orders)
}

export const saveOrderPayment = async (req, res) => {
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

export const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        const deletedOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deletedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}

export const deliverOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.deliveredAt = Date.now();
        order.isDelivered = true;

        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}