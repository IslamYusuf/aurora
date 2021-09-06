import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table, TableBody, TableCell,TableHead, 
    TableRow, Paper, TableContainer, Button, ButtonGroup,
} from '@material-ui/core';
import { 
    withStyles, makeStyles  
} from '@material-ui/core/styles';

import { deleteOrder, listAllOrders } from '../../actions/orderActions';
import Loading from '../Loading';
import Message from '../Message';
import { ORDER_DELETE_RESET } from '../../constants/orderConstants';

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
    },
    container:{
        marginBottom: 25,
    },
});

const OrderList = (props) => {
    const classes = useStyles();
    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;
    const orderDelete = useSelector((state) => state.orderDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = orderDelete;

    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ORDER_DELETE_RESET });
        dispatch(listAllOrders());
    }, [dispatch, successDelete, userInfo._id]);
    const deleteHandler = (order) => {
        if (window.confirm('Are you sure you want to delete?')) {
        dispatch(deleteOrder(order._id));
        }
  };

    return (
        <div>
            <h1>Orders</h1>
            {loadingDelete && <Loading></Loading>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loading ? (<Loading></Loading>)
            : error ? (<Message variant="danger">{error}</Message>) 
            :(
                <TableContainer component={Paper} className={classes.container}>
                <Table className={classes.table} aria-label="customized table" size='small'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell align="right">USER</StyledTableCell>
                            <StyledTableCell align="right">Date</StyledTableCell>
                            <StyledTableCell align="right">TOTAL</StyledTableCell>
                            <StyledTableCell align="right">PAID</StyledTableCell>
                            <StyledTableCell align="right">DELIVERED</StyledTableCell>
                            <StyledTableCell align="right">ACTIONS</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {orders.map((order) => (
                        <StyledTableRow key={order._id}>
                        <StyledTableCell component="th" scope="row">
                            {order._id}
                        </StyledTableCell>
                        <StyledTableCell align="right">{order.shippingAddress.fullName}</StyledTableCell>
                        <StyledTableCell align="right">{order.createdAt.substring(0, 10)}</StyledTableCell>
                        <StyledTableCell align="right">{order.totalPrice.toFixed(2)}</StyledTableCell>
                        <StyledTableCell align="right">{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</StyledTableCell>
                        <StyledTableCell align="right">
                            {order.isDelivered
                                ? order.updatedAt.substring(0, 10)
                                : "No"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <ButtonGroup variant="contained" disableFocusRipple 
                            disableRipple size='small'>
                                <Button 
                                color='primary' size='small'
                                onClick={() => props.history.push(`/order/${order._id}`)}>
                                    Details
                                </Button>
                                <Button 
                                color='secondary' size='small'
                                onClick={() => deleteHandler(order)}>
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

export default OrderList
