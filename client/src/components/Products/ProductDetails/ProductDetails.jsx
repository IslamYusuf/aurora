import {Link, useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';

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
                                    <h1>{product.name}</h1>
                                </li>
                                <li>
                                    <Rating rating={product.rating} reviews={product.numReviews}  />
                                </li>
                                <li>Price: ${product.price}</li>
                                <li>Description:
                                    <p>{product.description}</p>
                                </li>
                            </ul>
                        </div>
                        <div className="col-1">
                            <div className="card card-body" >
                                <ul>
                                    <li>
                                        <div className="row" >
                                            <div>Price</div>
                                            <div className="price">${product.price}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row" >
                                            <div>Stauts</div>
                                            <div>
                                                {product.countInStock > 0 
                                                ? ( <span className="success">In Stock</span> )
                                                : ( <span className="danger">Unavailable</span> )
                                                }
                                            </div>
                                        </div>
                                    </li>
                                    {
                                        product.countInStock > 0 && (
                                            <>
                                            <li>
                                                <div className='row'>
                                                    <div>Qty</div>
                                                    <div>
                                                        <select value={qty} onChange={e => setQty(e.target.value)}>
                                                            {
                                                                [...Array(product.countInStock).keys()].map(
                                                                    (x) => (
                                                                        <option key={x +1} value={x + 1}>{x + 1}</option>
                                                                    )
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </li>
                                                <li>
                                                    <button onClick={addToCartHandler} className="primary block">Add to Cart</button>
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