import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';

import { getProduct, updateProduct } from '../../../actions/productActions';
import Loading from '../../Loading';
import Message from '../../Message';
import { PRODUCT_UPDATE_RESET } from '../../../constants/productConstants';

const ProductEdit = (props) => {
    const productId = props.match.params.id;
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    const { loading, error, product } = useSelector((state) => state.product);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = useSelector((state) => state.productUpdate);

    const dispatch = useDispatch();
    useEffect(() => {
        if (successUpdate) {
            props.history.push('/productlist');
        }
        if (!product || product._id !== productId || successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch(getProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [product, dispatch, productId, successUpdate, props.history]);
    const submitHandler = (e) => {
        e.preventDefault();
        // TODO: dispatch update product
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            category,
            brand,
            countInStock,
            description,
        })
        );
    };
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const { userInfo } = useSelector((state) => state.user);
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
        const { data } = await Axios.post('/api/uploads', bodyFormData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
            },
        });
        setImage(data);
        setLoadingUpload(false);
        } catch (error) {
        setErrorUpload(error.message);
        setLoadingUpload(false);
        }
    };

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product {productId}</h1>
                </div>
                {loadingUpdate && <Loading></Loading>}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {loading ? (<Loading></Loading>)
                : error ? (<Message variant="danger">{error}</Message>) : (
                <>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="price">Price</label>
                        <input
                            id="price"
                            type="text"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="image">Image</label>
                        <input
                            id="image"
                            type="text"
                            placeholder="Enter image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="imageFile">Image File</label>
                        <input
                            type="file"
                            id="imageFile"
                            label="Choose Image"
                            onChange={uploadFileHandler}
                        ></input>
                        {loadingUpload && <Loading></Loading>}
                        {errorUpload && (
                            <Message variant="danger">{errorUpload}</Message>
                        )}
                    </div>
                    <div>
                        <label htmlFor="category">Category</label>
                        <input
                            id="category"
                            type="text"
                            placeholder="Enter category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="brand">Brand</label>
                        <input
                            id="brand"
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="countInStock">Count In Stock</label>
                        <input
                            id="countInStock"
                            type="text"
                            placeholder="Enter countInStock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows="3"
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <label></label>
                        <button className="primary" type="submit">
                            Update
                        </button>
                    </div>
                </>
                )}
            </form>            
        </div>
    );
}

export default ProductEdit
