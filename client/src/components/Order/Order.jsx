import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { detailsOrder, payOrder } from '../../actions/orderActions';

import Loading from '../Loading';
import Message from '../Message';

const Order = () => {
    const dispatch = useDispatch();
    const {id} = useParams();
    const {order, loading, error } = useSelector(state => state.orderDetails);
    const {success, error: errorPay, loading: loadingPay} = useSelector(state => state.orderPayment);

    useEffect(() => {
        dispatch(detailsOrder(id))
    }, [dispatch, id])

    // This Handler is for implementing succesful payment transsaction (Srtirpe)
    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult));
    }
 
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
                                ? (<Message variant='success'>Delivered at {order.deliveredAt}</Message>)
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
                                
                                                    <div>{item.qty} x ${item.price} = ${item.qty * item.price}</div>
                                                    
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
                                    <div>${order.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Shipping</div>
                                    <div>${order.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Tax</div>
                                    <div>${order.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>
                                        <strong>Order Total</strong>
                                    </div>
                                    <div>
                                        <strong>${order.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Order;
