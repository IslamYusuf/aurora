import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
    Button, Divider, FormControl, FormLabel,
    RadioGroup,FormControlLabel,Radio,
} from '@material-ui/core';

import { createOrder } from '../../actions/orderActions';
import { ORDER_CREATE_RESET } from '../../constants/orderConstants';
import CheckoutSteps from '../Cart/CheckoutSteps';
import Loading from '../Loading';
import Message from '../Message';
import { savePaymentMethod } from '../../actions/cartActions';

const PlaceOrder = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart)
    const {userInfo} = useSelector(state => state.user)
    const {shippingAddress:{fullName, address, city, postalCode, country}, paymentMethod, cartItems} = cart;

    if(!paymentMethod){
        history.push('/shipping');
    }

    const {loading, success, error, order} = useSelector(state => state.order)
    
    const toPrice = (num) => Number(num.toFixed(2));
    cart.itemsPrice = toPrice(cartItems.reduce((a, c) => a + c.qty * c.price, 0));
    cart.shippingPrice = cart.itemsPrice < 100 ? toPrice(1) : toPrice(0)
    cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    const placeOrderHandler = () =>{
        dispatch(createOrder({...cart, orderItems: cartItems}))
    }

    useEffect(() => {
        if(success){
            history.push(`/order/${order._id}`);
            dispatch({type: ORDER_CREATE_RESET});
        }
    }, [dispatch, success, order, history])

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <div className='row top'>
                <div className='col-2' >
                    <ul>
                        <li>
                            <div className='card card-body'>
                                <h1>Shipping</h1>
                                <p>
                                    <strong>Name:</strong> {fullName} <br />
                                    <strong>Address:</strong> {address},
                                    {postalCode}, {city},
                                    {country} <br />
                                    <strong>User Account:</strong> {userInfo.email}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className='card card-body'>
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong> {paymentMethod} <br />
                                </p>
                            </div>
                        </li>
                        <li>
                            <div className='card card-body'>
                                <h2>Order Items</h2>
                                <ul>
                                    {
                                        cartItems.map((item) => (
                                            <li key={item.product}>
                                                <div className='row' >
                                                    <div>
                                                        <img 
                                                        src={item.image}
                                                        alt={item.name}
                                                        className='small' />
                                                    </div>
                                                    <div className='min-30' >
                                                        <Link to={`/product/${item.product}`} >{item.name}</Link>
                                                    </div>
                                
                                                    <div>{item.qty} x Ksh{item.price} = Ksh{item.qty * item.price}</div>
                                                    
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className='col-1' >
                    <div className='card card-body'>
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Items</div>
                                    <div>Ksh{cart.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Delivery</div>
                                    <div>Ksh{cart.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>V.a.t</div>
                                    <div>Ksh{cart.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>
                                        <strong>Order Total</strong>
                                    </div>
                                    <div>
                                        <strong>Ksh{cart.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Button
                                    onClick={placeOrderHandler}
                                    fullWidth variant='contained' color='primary'
                                    disabled={cartItems.length === 0}
                                >
                                    Place Order
                                </Button>
                            </li>
                            {loading && <Loading />}
                            {error && <Message variant='danger' >{error}</Message>}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PlaceOrder;
