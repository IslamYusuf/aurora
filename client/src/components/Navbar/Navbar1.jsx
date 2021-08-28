//import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useLocation, useHistory, useParams} from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Badge, Typography, Divider} from '@material-ui/core';
import {ShoppingCart, AccountCircle, SupervisorAccount,} from '@material-ui/icons';

import { signout } from '../../actions/userActions';
import useStyles from './styles'

const NavbarBar = () => {
    const {cartItems} = useSelector(state => state.cart)
    const {userInfo} = useSelector(state => state.user)
    const {search} = useLocation();  
    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const redirect = id ? '/' : search ? search.split('=')[1] : '/';

    const signoutHandler = () =>{
        history.push('/');
        dispatch(signout());
    }
    const classes = useStyles();
    
    return (
        <AppBar position='fixed' color='primary' >
            <Toolbar className={classes.toolbar}>
                <div>
                    <Typography component={Link} to='/' variant='h4' color='inherit'>
                            Aurora
                    </Typography>
                </div>
                <div className={classes.baseline}>
                    <IconButton component={Link} to="/cart" aria-label="Cart" color="inherit">
                        <Badge badgeContent={cartItems.length} color="secondary">
                            <ShoppingCart fontSize="large" />
                        </Badge>
                    </IconButton>
                    {
                        userInfo
                        ? (
                            <div className='dropdown'>
                                <Typography component={Link} to='#' variant='h4'>
                                        <AccountCircle fontSize='large' />
                                </Typography>
                                <ul className='dropdown-content'>
                                    <li>
                                        <Typography variant='h4' align='center'>
                                            {`${userInfo.firstName} ${userInfo.lastName}`}
                                        </Typography>
                                    </li>
                                    <Divider/>
                                    <li>
                                        <Typography align='center'component={Link} to='/profile' variant='h5'>
                                            User Profile
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography align='center'component={Link} to='/orderhistory' variant='h5'>
                                            Order History
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography align='center'component={Link} to='#signout' onClick={signoutHandler} variant='h5'>
                                            Sign Out
                                        </Typography>
                                    </li>
                                </ul>
                            </div>
                        )
                        : (<Typography component={Link} to={`/signin?redirect=${redirect}`} variant='h4'>Sign In</Typography>)
                    }
                    {
                        userInfo && userInfo.isAdmin && (
                            <div className='dropdown'>
                                <Typography component={Link} to='#admin' variant='h4'>
                                        <SupervisorAccount fontSize='large'/>
                                </Typography>
                                <div className='dropdown-content'>
                                    <ul>
                                        <li>
                                            <Typography variant='h4' align='center'>
                                                Admin
                                            </Typography>
                                        </li>
                                        <Divider/>
                                        <li>
                                            <Typography variant='h5' component={Link} to='/dashboard'>
                                                    Dashboard
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant='h5' component={Link} to='/productlist'>
                                                    Products
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant='h5' component={Link} to='/orderlist'>
                                                    Orders
                                            </Typography>
                                        </li>
                                        <li>
                                            <Typography variant='h5' component={Link} to='/userlist'>
                                                    Users
                                            </Typography>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}
export default NavbarBar;