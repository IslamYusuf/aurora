import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import {
    Button, TextField, Grid, Typography, Container,
} from '@material-ui/core';

import { getProduct, updateProduct } from '../../../actions/productActions';
import Loading from '../../Loading';
import Message from '../../Message';
import { PRODUCT_UPDATE_RESET } from '../../../constants/productConstants';
import useStyles from './styles';

const ProductEdit = (props) => {
    const classes = useStyles();
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
            _id: productId, name, price, image, category,
            brand, countInStock, description,
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
            <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <form className={classes.form} onSubmit={submitHandler}>
                    <Typography component='h1' variant='h5'>
                        Product Edit {productId}
                    </Typography>
                    {loadingUpdate && <Loading></Loading>}
                    {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                    {loading ? (<Loading></Loading>)
                    : error ? (<Message variant="danger">{error}</Message>) : (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                    variant="outlined" margin="normal" required fullWidth id="name"
                                    label="Name" name="name" autoFocus
                                    onChange={(e) => setName(e.target.value)} value={name}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth name="category"
                                    label="Category" id="category" value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth name="brand"
                                    label="Brand" id="brand" value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth
                                    name="price" label="Price" id="price" value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth name="countInStock"
                                    label="Count In Stock" id="countInStock" value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth maxRows='3'
                                    type='text' name="description" label="Enter description..." 
                                    id="description" value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth
                                    name="image" label="Image" id="image" value={image}
                                    onChange={(e) => setImage(e.target.value)} disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    variant="outlined" margin="normal" required fullWidth
                                    type="file" id="imageFile"
                                    onChange={uploadFileHandler}
                                    />
                                </Grid>
                                <Grid item lg={12}>
                                    {loadingUpload && <Loading></Loading>}
                                    {errorUpload && (
                                        <Message variant="danger">{errorUpload}</Message>
                                    )}
                                </Grid>
                                
                                
                            </Grid>
                            <Button
                                type="submit" fullWidth variant="contained"
                                color="primary" className={classes.submit}
                            >Update</Button>
                        </>
                    )}
                </form>
            </div>
        </Container>
    );
}

export default ProductEdit
