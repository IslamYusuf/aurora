import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';

import useStyles from './styles';
import Rating from '../Rating';

const Product = ({product}) => {
    const classes = useStyles();
    
    return (
        <Card className={classes.root} key={product._id}>
            <div >
                <Link to={`/product/${product._id}`}>
                    <img height='230px' width='100%' src={product.image} alt={product.name}/>
                </Link>
            </div>
            <CardContent>
                <div className={classes.cardContent}>
                    <Link to={`/product/${product._id}`}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {product.name}
                        </Typography>
                    </Link>
                    <Typography gutterBottom variant="h5" component="h2">
                        Ksh{product.price}
                    </Typography>
                </div>
                <Rating rating={product.rating} reviews={product.numReviews} />
            </CardContent>            
        </Card>
    )
}

export default Product

//<CardActions disableSpacing className={classes.cardActions}>
//    <IconButton aria-label="Add to Cart" >
//    <AddShoppingCart />
//   </IconButton>
//</CardActions>
