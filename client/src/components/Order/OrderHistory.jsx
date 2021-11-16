import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import { listOrders } from '../../actions/orderActions';
import {
    Table, TableBody, TableCell,TableHead, 
    TableRow, Paper, TableContainer, Button,
} from '@material-ui/core';
import { 
    withStyles, makeStyles  
} from '@material-ui/core/styles';

import Loading from '../Loading';
import Message from '../Message';

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
});

const OrderHistory = () => {
    const classes = useStyles();
    const history = useHistory();
    const {loading, error, orders} = useSelector(state => state.orderList)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(listOrders());
    }, [dispatch])

    return (
        <div>
            <h1>Order History</h1>
            {loading 
            ? <Loading />
            : error ? <Message variant='danger'>{error}</Message>
            :(
                <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
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
                        <StyledTableCell align="right">{order.createdAt.substring(0, 10)}</StyledTableCell>
                        <StyledTableCell align="right">{order.totalPrice.toFixed(2)}</StyledTableCell>
                        <StyledTableCell align="right">{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</StyledTableCell>
                        <StyledTableCell align="right">
                            {order.isDelivered
                                ? order.updatedAt.substring(0, 10)
                                : "No"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <Button 
                            color='primary' variant="contained" 
                            disableFocusRipple disableRipple size="small"
                            onClick={() => history.push(`/order/${order._id}`)}>
                                Details
                            </Button>
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

export default OrderHistory
