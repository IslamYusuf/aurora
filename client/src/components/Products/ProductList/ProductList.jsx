import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
//import { Link, useParams } from 'react-router-dom';
import {
    Table, TableBody, TableCell,TableHead, 
    TableRow, Paper, TableContainer, Button, ButtonGroup,
} from '@material-ui/core';
import { 
    withStyles, makeStyles  
} from '@material-ui/core/styles';

import {createProduct,deleteProduct,getProducts,} from '../../../actions/productActions';
import Loading from '../../Loading';
import Message from '../../Message';
import {PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET,} from '../../../constants/productConstants';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    },
},
}))(TableRow);
  
const useStyles = makeStyles({
    table: {
        minWidth: 700,
        //marginBottom: 20,
        marginTop: 5,
    },
    container:{
        marginBottom: 25,
    },
});

const ProductList = () => {
    const classes = useStyles();
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
        dispatch(getProducts({}));
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
                <Button color='primary' variant='contained' 
                onClick={createHandler}>
                    Create Product
                </Button>
            </div>
            {loadingDelete && <Loading></Loading>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loadingCreate && <Loading></Loading>}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}
            {loading ? (<Loading></Loading>) : error
            ? (<Message variant="danger">{error}</Message>) 
            :(
                <TableContainer component={Paper} className={classes.container}>
                <Table className={classes.table} aria-label="customized table"size='small'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell align="right">NAME</StyledTableCell>
                            <StyledTableCell align="right">PRICE</StyledTableCell>
                            <StyledTableCell align="right">CATEGORY</StyledTableCell>
                            <StyledTableCell align="right">BRAND</StyledTableCell>
                            <StyledTableCell align="right">ACTIONS</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {products.map((product) => (
                        <StyledTableRow key={product._id}>
                        <StyledTableCell component="th" scope="row">
                            {product._id}
                        </StyledTableCell>
                        <StyledTableCell align="right">{product.name}</StyledTableCell>
                        <StyledTableCell align="right">{product.price}</StyledTableCell>
                        <StyledTableCell align="right">{product.category}</StyledTableCell>
                        <StyledTableCell align="right">{product.brand}</StyledTableCell>
                        <StyledTableCell align="right">
                            <ButtonGroup variant="contained" disableFocusRipple 
                            disableRipple size='small'>
                                <Button 
                                color='primary'  size='small'
                                onClick={() =>
                                    history.push(`/product/${product._id}/edit`)
                                }>
                                    Edit
                                </Button>
                                <Button 
                                color='secondary'  size='small'
                                onClick={() => deleteHandler(product)}>
                                    Delete
                                </Button>    
                            </ButtonGroup>
                            
                        </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            )}
        </div>
    )
}

export default ProductList
