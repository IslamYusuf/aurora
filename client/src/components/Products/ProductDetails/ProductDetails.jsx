import {Link, useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {
    Typography, Button,
} from '@material-ui/core';

import Rating from '../Rating';
import Loading from '../../Loading';
import Message from '../../Message';
import { getProduct } from '../../../actions/productActions';

const ProductDetails = () => {
    const [qty, setQty] = useState(1)
    const dispatch = useDispatch();
    const history = useHistory()
    const {loading, error, product} = useSelector((state) => state.product);
    const {id} = useParams();

    useEffect(() => {
        dispatch(getProduct(id))
        
    }, [dispatch, id]);

    const addToCartHandler = () =>{
        history.push(`/cart/${id}?qty=${qty}`)
    }

    return (
        <div>
            {loading ? <Loading></Loading>
            : error ? (<Message variant="danger">{error}</Message>)
            : (
                <div>
                    <Link to="/">Back to Home</Link>
                    <div className="row top">
                        <div className="col-2">
                            <img className="large" src={product.image} alt={product.name} />
                        </div>
                        <div className="col-1">
                            <ul>
                                <li>
                                    <Typography variant='h1' style={{ fontWeight: 600}}>
                                        {product.name}
                                    </Typography>
                                </li>
                                <li>
                                    <Rating rating={product.rating} reviews={product.numReviews}  />
                                </li>
                                <li>
                                    <Typography>Price: Ksh{product.price}</Typography>
                                </li>
                                <li>Description: 
                                    <Typography>
                                        {product.description}
                                    </Typography>
                                </li>
                            </ul>
                        </div>
                        <div className="col-1">
                            <div className="card card-body" >
                                <ul>
                                    <li>
                                        <div className="row" >
                                            <Typography>Price</Typography>
                                            <Typography style={{ fontSize: '2rem'}}>
                                                Ksh{product.price}
                                            </Typography>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row" >
                                            <Typography>Status</Typography>
                                            <Typography>
                                                {product.countInStock > 0 
                                                ? ( <span className="success">In Stock</span> )
                                                : ( <span className="danger">Unavailable</span> )
                                                }
                                            </Typography>
                                        </div>
                                    </li>
                                    {
                                        product.countInStock > 0 && (
                                            <>
                                            <li>
                                                <div className='row'>
                                                    <Typography>Qty</Typography>
                                                    <select value={qty}
                                                    onChange={e => setQty(e.target.value)}>
                                                        {
                                                                [...Array(product.countInStock).keys()].map(
                                                                    (x) => (
                                                                        <option key={x +1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    )
                                                                )
                                                            }
                                                    </select>
                                                </div>
                                            </li>
                                                <li>
                                                    <Button
                                                    onClick={addToCartHandler} 
                                                    fullWidth variant='contained' color='primary'>
                                                        Add to Cart
                                                    </Button>
                                                </li>
                                            </>
                                        )
                                    }
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                )
            }
        </div>   
    )
}

export default ProductDetails;