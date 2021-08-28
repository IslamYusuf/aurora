import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
//import { Link, useParams } from 'react-router-dom';


import {createProduct,deleteProduct,getProducts,} from '../../../actions/productActions';
import Loading from '../../Loading';
import Message from '../../Message';
import {PRODUCT_CREATE_RESET,PRODUCT_DELETE_RESET,} from '../../../constants/productConstants';

const ProductList = () => {
    const history = useHistory();
    const { loading, error, products,} = useSelector((state) => state.products);

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;

    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        if (successCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET });
            history.push(`/product/${createdProduct._id}/edit`);
        }
        if (successDelete) {
            dispatch({ type: PRODUCT_DELETE_RESET });
        }
        dispatch(getProducts());
    }, [createdProduct,dispatch,history,successCreate,successDelete,userInfo._id,]);

    const deleteHandler = (product) => {
        if (window.confirm('Are you sure you want to delete?')) {
        dispatch(deleteProduct(product._id));
        }
    };
    const createHandler = () => {
        dispatch(createProduct());
    };
    return (
        <div>
            <div className="row">
                <h1>Products</h1>
                <button type="button" className="primary" onClick={createHandler}>
                    Create Product
                </button>
            </div>
            {loadingDelete && <Loading></Loading>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}

            {loadingCreate && <Loading></Loading>}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            {loading ? (<Loading></Loading>) : error
            ? (<Message variant="danger">{error}</Message>) 
            : (
                <>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <button
                                type="button"
                                className="small"
                                onClick={() =>
                                    history.push(`/product/${product._id}/edit`)
                                }
                                >
                                Edit
                                </button>
                                <button
                                type="button"
                                className="small"
                                onClick={() => deleteHandler(product)}
                                >
                                Delete
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

export default ProductList
