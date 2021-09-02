import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useHistory, Link} from 'react-router-dom';
import { addToCart, removeFromCart, emptyCart} from '../../actions/cartActions';
import { 
    Container, Typography, Button, 
    Grid, Card, CardMedia,CardActions, CardContent 
} from '@material-ui/core';

import Message from '../Message';
import useStyles from './styles';

const Cart = () => {
    const classes = useStyles();
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
    const addToCartHandler = (sign, product, qty, countInStock) =>{
        if(sign === 'ADD'){
            dispatch(addToCart(product, (qty + 1) > countInStock ? countInStock : qty + 1))
        }
        else dispatch(addToCart(product, (qty - 1) < 1 ? 1 : qty - 1))
    }
    const checkoutHandler = () =>{
        history.push('/signin?redirect=shipping')
    }

    const renderEmptyCart = () => (
        <Typography variant="h5">You have no items in your shopping cart,
          <Link  to="/"> start shopping</Link>!
        </Typography>
      );

    const renderCart = () => (
        <Grid container spacing={2}>
          {cartItems.map((item) => (
                <Grid item xs={12} sm={3} key={item.product}>
                    <Card className="cartItem">
                        <div >
                            <Link to={`/product/${item.product}`}>
                                <img height='230px' width='100%' src={item.image} alt={item.name}/>
                            </Link>
                        </div>
                        <CardContent className={classes.cardContent}>
                            <Link to={`/product/${item.product}`}>
                                <Typography variant="h4">{item.name}</Typography>
                            </Link>
                            <Typography variant="h5">{`Ksh${item.price}`}</Typography>
                        </CardContent>
                        <CardActions className={classes.cartActions}>
                            <div className={classes.buttons}>
                                <Button 
                                type="button" size="small"
                                onClick={() => addToCartHandler('MINUS',item.product, item.qty,item.countInStock)}
                                >-</Button>
                                <Typography>&nbsp;{item.qty}&nbsp;</Typography>
                                <Button 
                                type="button" size="small" 
                                onClick={() => addToCartHandler('ADD',item.product, item.qty,item.countInStock)}
                                >+</Button>
                            </div>
                            <Button 
                            variant="contained" type="button" color="secondary" 
                            onClick={() => removeFromCartHandler(item.product)}
                            >Delete</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
          <div className={classes.cardDetails}>
            <Typography variant="h4">
                Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)
                : ${cartItems.reduce((a,c) => a + c.price * c.qty, 0)}
            </Typography>
            <div >
              <Button 
               size="large" type="button" 
               className={classes.emptyButton}
              variant="contained" color="secondary" onClick={() => dispatch(emptyCart())}
              >Empty cart</Button>
              <Button  onClick={checkoutHandler}
              className={classes.checkoutButton}
              size="large" type="button" variant="contained" 
              color="primary" disabled={cartItems.length === 0}>
                  Proceed To Checkout
                </Button>
            </div>
          </div>
        </Grid>
      );

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>Shopping Cart</Typography>
            { !cartItems.length ? renderEmptyCart() : renderCart() }
        </Container>
    )
}

export default Cart;
