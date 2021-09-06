import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table, TableBody, TableCell,TableHead, 
    TableRow, Paper, TableContainer, Button, ButtonGroup,
} from '@material-ui/core';
import { 
    withStyles, makeStyles  
} from '@material-ui/core/styles';

import { deleteUser, listUsers } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';
import { USER_DETAILS_RESET } from '../../constants/userConstants';

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

const UserList = (props) => {
    const classes = useStyles();
    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;
    const userDelete = useSelector((state) => state.userDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = userDelete;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listUsers());
        dispatch({type: USER_DETAILS_RESET,});
    }, [dispatch, successDelete]);
    const deleteHandler = (user) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(user._id));
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {loadingDelete && <Loading></Loading>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {successDelete && (
                <Message variant="success">User Deleted Successfully</Message>
            )}
            {loading ? (<Loading></Loading>)
            : error ? (<Message variant="danger">{error}</Message>)
            : (
                <TableContainer component={Paper} className={classes.container}>
                <Table className={classes.table} aria-label="customized table"size='small'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell align="right">NAME</StyledTableCell>
                            <StyledTableCell align="right">EMAIL</StyledTableCell>
                            <StyledTableCell align="right">IS ADMIN</StyledTableCell>
                            <StyledTableCell align="right">ACTIONS</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map((user) => (
                        <StyledTableRow key={user._id}>
                        <StyledTableCell scope="row">{user._id}</StyledTableCell>
                        <StyledTableCell component="th" align='right'>
                            {`${user.firstName} ${user.lastName}`}
                        </StyledTableCell>
                        <StyledTableCell align="right">{user.email}</StyledTableCell>
                        <StyledTableCell align="right">{user.isAdmin ? 'YES' : 'NO'}</StyledTableCell>
                        <StyledTableCell align="right">
                            <ButtonGroup variant="contained" disableFocusRipple 
                            disableRipple size='small'>
                                <Button 
                                color='primary' size='small'
                                onClick={() => props.history.push(`/user/${user._id}/edit`)}>
                                    Edit
                                </Button>
                                <Button 
                                color='secondary' size='small'
                                onClick={() => deleteHandler(user)}>
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

export default UserList
