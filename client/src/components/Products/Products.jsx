import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Grid from '@material-ui/core/Grid';

import Product from "./Product/Product"
import Loading from '../Loading';
import Message from '../Message';
import { getProducts } from '../../actions/productActions';
import useStyles from './styles';

const Products = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {loading, error, products} = useSelector(state => state.products);

    useEffect(() => {
        dispatch(getProducts())
    }, [dispatch]);

    return (
        <main className={classes.content}>
            {loading ? <Loading></Loading>
            : error ? (<Message variant="danger">{error}</Message>)
            : (
                <Grid container justifyContent="center" spacing={4}>
                    {products.map((product) => (
                        <Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
                            <Product product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </main>
    )
}

export default Products
