import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import { listOrders } from '../../actions/orderActions';

import Loading from '../Loading';
import Message from '../Message';

const OrderHistory = () => {
    const history = useHistory();
    const {loading, error, orders} = useSelector(state => state.orderList)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(listOrders());
    }, [dispatch])

    return (
        <div>
            <h1>Order History</h1>
            {loading 
            ? <Loading />
            : error ? <Message variant='danger'>{error}</Message>
            : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                                <td>{order.isDelivered
                                    ? order.deliveredAt.substring(0, 10)
                                    : "No" }
                                </td>
                                <td>
                                    <button
                                    type='button'
                                    className='small'
                                    onClick={() => history.push(`/order/${order._id}`)} >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
        </div>
    )
}

export default OrderHistory
