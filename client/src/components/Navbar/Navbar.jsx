import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Link, useLocation, useHistory,
    useParams, Route,
} from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Badge, Typography, Divider } from '@material-ui/core';
import { ShoppingCart, AccountCircle, SupervisorAccount, } from '@material-ui/icons';

import { signout } from '../../actions/userActions';
import { listProductCategories } from '../../actions/productActions';
import useStyles from './styles'
import SearchBox from '../Products/SearchBox';
import Loading from '../Loading';
import Message from '../Message';


const NavbarBar = () => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const { cartItems } = useSelector(state => state.cart)
    const { userInfo } = useSelector(state => state.user)
    const {
        loading: loadingCategories,
        error: errorCategories,
        categories,
    } = useSelector((state) => state.productCategory);
    const { search } = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const redirect = id ? '/' : search ? search.split('=')[1] : '/';

    const signoutHandler = () => {
        history.push('/');
        dispatch(signout());
    }
    const classes = useStyles();

    useEffect(() => {
        dispatch(listProductCategories());
    }, [dispatch]);

    return (
        <>
            <AppBar position='fixed' color='primary' >
                <Toolbar className={classes.toolbar}>
                    <div>
                        <button
                            type="button"
                            className="open-sidebar"
                            onClick={() => setSidebarIsOpen(true)}
                        >
                            <i className="fa fa-bars"></i>
                        </button>
                        <Typography component={Link} to='/' variant='h4' color='inherit'>
                            Aurora
                        </Typography>
                    </div>
                    <div>
                        <Route
                            render={({ history }) => (
                                <SearchBox history={history}></SearchBox>
                            )}
                        ></Route>
                    </div>
                    <div className={classes.baseline}>
                        <IconButton component={Link} to="/cart" aria-label="Cart" color="inherit">
                            <Badge badgeContent={cartItems.length} color="secondary">
                                <ShoppingCart style={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>
                        {
                            userInfo
                                ? (
                                    <div className='dropdown'>
                                        <Typography component={Link} to='#' variant='h4'>
                                            <AccountCircle style={{ fontSize: 22 }} />
                                        </Typography>
                                        <ul className='dropdown-content'>
                                            <li>
                                                <Typography variant='h4' align='center'>
                                                    {`${userInfo.firstName} ${userInfo.lastName}`}
                                                </Typography>
                                            </li>
                                            <Divider />
                                            <Divider />
                                            <Divider />
                                            <li>
                                                <Typography align='center' component={Link} to='/profile' variant='h5'>
                                                    User Profile
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography align='center' component={Link} to='/orderhistory' variant='h5'>
                                                    Order History
                                                </Typography>
                                            </li>
                                            <li>
                                                <Typography align='center' component={Link} to='#signout' onClick={signoutHandler} variant='h5'>
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
                                        <SupervisorAccount style={{ fontSize: 22 }} />
                                    </Typography>
                                    <div className='dropdown-content'>
                                        <ul>
                                            <li>
                                                <Typography variant='h4' align='center'>
                                                    Admin
                                                </Typography>
                                            </li>
                                            <Divider />
                                            <Divider />
                                            <Divider />
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
                <aside className={sidebarIsOpen ? 'open' : ''}>
                    <ul className="categories">
                        <li>
                            <strong>Categories</strong>
                            <button
                                onClick={() => setSidebarIsOpen(false)}
                                className="close-sidebar"
                                type="button"
                            >
                                <i className="fa fa-close"></i>
                            </button>
                        </li>
                        {loadingCategories ? (
                            <Loading></Loading>
                        ) : errorCategories ? (
                            <Message variant="danger">{errorCategories}</Message>
                        ) : (
                            categories.map((c) => (
                                <li key={c}>
                                    <Link
                                        to={`/search/category/${c}`}
                                        onClick={() => setSidebarIsOpen(false)}
                                    >
                                        {c}
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </aside>
            </AppBar>
        </>
    );
}
export default NavbarBar;