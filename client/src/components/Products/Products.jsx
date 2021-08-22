import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Product from "./Product/Product"
import Loading from '../Loading';
import Message from '../Message';
import { getProducts } from '../../actions/productActions';

const Products = () => {
    const dispatch = useDispatch();
    const {loading, error, products} = useSelector(state => state.products);

    useEffect(() => {
        dispatch(getProducts())
    }, [dispatch]);

    return (
        <div>
            {loading ? <Loading></Loading>
            : error ? (<Message variant="danger">{error}</Message>)
            : (<div className="row center">
                {
                    products.map( (product) => (
                        <Product product={product} key={product._id} />
                    ))
                }    
            </div>)
            }
        </div>
    )
}

export default Products
