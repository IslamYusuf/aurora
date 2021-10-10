import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Typography, Button, Divider} from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl,
    isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'

import { deliverOrder, detailsOrder, payOrder } from '../../actions/orderActions';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../../constants/orderConstants';
import Loading from '../Loading';
import Message from '../Message';
import { confirmMpesaOrderPayment, initiateMpesaPayment, payOrderStripe } from '../../actions/paymentActions';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Order = () => {
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState()
    const dispatch = useDispatch();
    const {id} = useParams();
    const {order, loading, error } = useSelector(state => state.orderDetails);
    const {
        success:successPay,
        error: errorPay,
        loading: loadingPay, 
        message: messagePay,
        pending: pendingPay,
    } = useSelector(state => state.orderPayment);
    const {
        loading: loadingDeliver,
        error: errorDeliver,
        success: successDeliver,
      } = useSelector((state) => state.orderDeliver);
    const {userInfo} = useSelector((state) => state.user);

    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
    };

    const mpesaPaymentHandler = (e) =>{
        e.preventDefault();

        const intlFormat = formatPhoneNumberIntl(mpesaPhoneNumber)
        dispatch(initiateMpesaPayment(order, intlFormat.substring(1)));
    }

    const confirmMpesaPaymentHandler = () =>{
        //Todo: dispatch an action to get the details of the order
        dispatch(confirmMpesaOrderPayment(order))
    }

    const handleStripePayment = async (e, elements, stripe) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const result = await stripe.confirmCardPayment(order.stripeInfo.clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${order.user.firstName} ${order.user.lastName}`,
                email: order.user.email,
              },
            }
        });
        
        if (result.error) {
            console.log('[error]', result.error);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                dispatch(payOrderStripe(order, result.paymentIntent));
              }
        }
    };

    useEffect(() => {
        if (!order || successPay || successDeliver || pendingPay || (order && order._id !== id)){
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(detailsOrder(id));
          } 
    }, [dispatch, id, order, successDeliver, successPay, pendingPay])
 
    return loading ? (<Loading />) 
    : error ? (<Message variant='danger' >{error}</Message>)
    : (
        <div>
            <h1>Order {order._id}</h1>
            <div className='row top'>
                <div className='col-2' >
                    <ul>
                        <li>
                            <div className='card card-body'>
                                <h1>Shipping</h1>
                                <p>
                                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                                    <strong>Address:</strong> {order.shippingAddress.address},
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode},
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered 
                                ? (<Message variant='success'>Delivered at {order.updatedAt}</Message>)
                                : (<Message variant='danger'>Not Delivered</Message>)
                            }
                            </div>
                        </li>
                        <li>
                            <div className='card card-body'>
                                <h2>Payment</h2>
                                <p>
                                    <strong>Method:</strong> {order.paymentMethod} <br />
                                </p>
                                {order.isPaid 
                                ? (<Message variant='success'>Paid at {order.paidAt}</Message>)
                                : (<Message variant='danger'>Not Paid</Message>)
                            }
                            </div>
                        </li>
                        <li>
                            <div className='card card-body'>
                                <h2>Order Items</h2>
                                <ul>
                                    {
                                        order.orderItems.map((item) => (
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
                                    <div>Ksh{order.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Shipping</div>
                                    <div>Ksh{order.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Tax</div>
                                    <div>Ksh{order.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>
                                        <strong>Order Total</strong>
                                    </div>
                                    <div>
                                        <strong>Ksh{order.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                            {!order.isPaid && order.paymentMethod === 'Stripe' ? (
                                <li>
                                    {!stripePromise ? (<Loading></Loading>) 
                                    : (
                                        <>
                                        {errorPay && (<Message variant="danger">{errorPay}</Message>)}
                                        {loadingPay && <Loading></Loading>}
                                        <Divider />
                                        <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
                                        <Elements stripe={stripePromise}>
                                            <ElementsConsumer>{({ elements, stripe }) => (
                                                <form onSubmit={(e) => handleStripePayment(e, elements, stripe)}>
                                                    <CardElement />
                                                    <br /> <br />
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                                                        Pay Ksh{order.totalPrice.toFixed(2)}
                                                    </Button>
                                                    </div>
                                                </form>
                                            )}
                                            </ElementsConsumer>
                                        </Elements>
                                        </>
                                    )}
                                </li>
                            ) : !order.isPaid && (
                                <li>
                                    {errorPay && (<Message variant="danger">{errorPay}</Message>)}
                                    {loadingPay && <Loading></Loading>}
                                    {messagePay && (<Message variant="success">
                                        {`${messagePay} Click on the 'CONFIRM PAYMENT' button below after paying using Mpesa.`}
                                    </Message>)}
                                    <Divider/>
                                    <Typography variant="h5" gutterBottom style={{ margin: '20px 0' }}>Mpesa Payment </Typography>
                                    {!loading && pendingPay 
                                        ? (
                                            <Button variant="contained" color="primary"
                                                onClick={() => confirmMpesaPaymentHandler()}>
                                                    CONFIRM PAYMENT
                                            </Button>
                                        )
                                        : !order.isPaid && (
                                            <form onSubmit={(e) => mpesaPaymentHandler(e)}>
                                                <PhoneInput
                                                    placeholder="Enter Mpesa phone number"
                                                    //countrySelectProps={{ unicodeFlags: true }}
                                                    defaultCountry='KE'
                                                    value={mpesaPhoneNumber}
                                                    onChange={setMpesaPhoneNumber}
                                                />
                                                <br /> <br />
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Button type="submit" variant="contained"
                                                    disabled={mpesaPhoneNumber ? !isValidPhoneNumber(mpesaPhoneNumber) : true}
                                                    color="primary">
                                                        Pay Ksh{order.totalPrice.toFixed(2)}
                                                    </Button>
                                                </div>
                                            </form>
                                        ) 
                                        }
                                        {/* Is possible: {mpesaPhoneNumber && isPossiblePhoneNumber(mpesaPhoneNumber) ? 'true' : 'false'}
                                        Is valid: {mpesaPhoneNumber && isValidPhoneNumber(mpesaPhoneNumber) ? 'true' : 'false'}
                                        National: {mpesaPhoneNumber && formatPhoneNumber(mpesaPhoneNumber)}
                                        International: {mpesaPhoneNumber && formatPhoneNumberIntl(mpesaPhoneNumber)} */} 
                                </li>
                            )}
                            {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <li>
                                    {loadingDeliver && <Loading></Loading>}
                                    {errorDeliver && (
                                        <Message variant="danger">{errorDeliver}</Message>
                                    )}
                                    <Button 
                                        variant="contained" color="primary"
                                        onClick={deliverHandler}
                                        size="large" type="button"
                                    >
                                        Deliver Order
                                    </Button> 
                                    
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order;