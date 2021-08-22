import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useHistory, Link } from 'react-router-dom';
import { addToCart, removeFromCart, } from '../../actions/cartActions';
import Message from '../Message';

const Cart = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const {search} = useLocation();
    const {cartItems} = useSelector(state => state.cart)
    
    const productId = params.id;
    const qty = search ? Number(search.split('=')[1]) : 1
    
    useEffect(() => {
        if(productId){
            dispatch(addToCart(productId, qty));
            history.push('/cart')
        }
    }, [dispatch, productId, qty,history]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }
    
    const checkoutHandler = () =>{
        history.push('/signin?redirect=shipping')
    }

    return (
        <div className='row top'>
            <div className='col-2'>
                <h1>Shopping Cart</h1>
                {
                    cartItems.length === 0 
                    ? <Message>
                        Cart is Empty. <Link to='/'>Go Shopping</Link>
                    </Message>
                    : (
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
                                            <div>
                                                <select 
                                                value={item.qty} 
                                                onChange={e => 
                                                dispatch(
                                                    addToCart(item.product, Number(e.target.value))
                                                    )
                                                }>
                                                    {
                                                                [...Array(item.countInStock).keys()].map(
                                                                    (x) => (
                                                                        <option key={x +1} value={x + 1}>{x + 1}</option>
                                                                    )
                                                                )
                                                            }
                                                </select>
                                            </div>
                                            <div>${item.price}</div>
                                            <div>
                                                <button
                                                type='button'
                                                onClick={() => removeFromCartHandler(item.product)} >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
            <div className='col-1' >
                <div className='card card-body'>
                    <ul>
                        <li>
                            <h2>
                                Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)
                                : ${cartItems.reduce((a,c) => a + c.price * c.qty, 0)}
                            </h2>
                        </li>
                        <li>
                            <button
                            type='button'
                            onClick={checkoutHandler}
                            className='primary block'
                            disabled={cartItems.length === 0}>Proceed To Checkout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Cart;
