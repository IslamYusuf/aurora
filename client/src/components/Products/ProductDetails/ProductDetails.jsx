import {Link, useParams, useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {
    Typography, Button,
} from '@material-ui/core';

import Rating from '../Rating';
import Loading from '../../Loading';
import Message from '../../Message';
import { getProduct, createReview, } from '../../../actions/productActions';
import { PRODUCT_REVIEW_CREATE_RESET } from '../../../constants/productConstants';

const ProductDetails = () => {
    const [qty, setQty] = useState(1)
    const dispatch = useDispatch();
    const history = useHistory()
    const {id} = useParams();
    
    const {loading, error, product} = useSelector((state) => state.product);
    const { userInfo } = useSelector((state) => state.user);
    const {
        loading: loadingReviewCreate,
        error: errorReviewCreate,
        success: successReviewCreate,
    } = useSelector((state) => state.productReview);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const addToCartHandler = () =>{
        history.push(`/cart/${id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (comment && rating) {
          dispatch(
            createReview(id, { rating, comment, name: `${userInfo.firstName} ${userInfo.lastName}`})
          );
          console.log(`${userInfo.firstName} ${userInfo.lastName}`)
        } else {
          alert('Please enter comment and rating');
        }
    };

    useEffect(() => {
        if (successReviewCreate) {
            window.alert('Review Submitted Successfully');
            setRating('');
            setComment('');
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
          }
        dispatch(getProduct(id))
        
    }, [dispatch, id, successReviewCreate]);

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
                    <div>
                        <h2 id="reviews">Reviews</h2>
                        {product.reviews.length === 0 && (
                        <Message>There is no review</Message>
                        )}
                        <ul>
                        {product.reviews.map((review) => (
                            <li key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating rating={review.rating} caption=" "></Rating>
                            <p>{review.createdAt.substring(0, 10)}</p>
                            <p>{review.comment}</p>
                            </li>
                        ))}
                        <li>
                            {userInfo ? (
                            <form className="form" onSubmit={submitHandler}>
                                <div>
                                <h2>Write a customer review</h2>
                                </div>
                                {loadingReviewCreate && <Loading></Loading>}
                                {errorReviewCreate && (
                                    <Message variant="danger">
                                    {errorReviewCreate}
                                    </Message>
                                )}
                                <div>
                                <label htmlFor="rating">Rating</label>
                                <select
                                    id="rating"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    <option value="1">1- Poor</option>
                                    <option value="2">2- Fair</option>
                                    <option value="3">3- Good</option>
                                    <option value="4">4- Very good</option>
                                    <option value="5">5- Excelent</option>
                                </select>
                                </div>
                                <div>
                                <label htmlFor="comment">Comment</label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                                </div>
                                <div>
                                <label />
                                <Button type='submit'
                                fullWidth variant='contained' color='primary'>
                                    Submit
                                </Button>
                                </div>
                                <div>
                                </div>
                            </form>
                            ) : (
                            <Message>
                                Please <Link to="/signin">Sign In</Link> to write a review
                            </Message>
                            )}
                        </li>
                        </ul>
                    </div>
                </div>
                )
            }
        </div>   
    )
}

export default ProductDetails;