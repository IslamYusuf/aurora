import { useDispatch, useSelector } from 'react-redux';
import {Link, useLocation, useHistory, useParams} from 'react-router-dom';

import { signout } from '../../actions/userActions';

const Navbar = () => {
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

    return (
        <>
            <header className="row">
                <div>
                    <Link className="brand" to="/">aurora</Link>
                </div>
                <div>
                    <Link to="/cart">Cart
                    {cartItems && cartItems.length > 0 && (
                        <span className='badge'> {cartItems.length} </span>
                    )}
                    </Link>
                    {
                        userInfo
                        ? ( 
                            <div className='dropdown'>
                                <Link to="#">{userInfo.name} <i className='fa fa-caret-down'/></Link>
                                <ul className='dropdown-content'>
                                    <li>
                                        <Link to='/profile'>User Profile</Link>
                                    </li>
                                    <li>
                                        <Link to='/orderhistory'>Order History</Link>
                                    </li>
                                    <li>
                                        <Link to='#signout' onClick={signoutHandler}>
                                            Sign Out
                                        </Link>
                                    </li>
                                </ul>
                            </div> 
                        )
                        : ( <Link to={`/signin?redirect=${redirect}`}>Sign In</Link> )
                    }
                    {userInfo && userInfo.isAdmin && (
                        <div className='dropdown'>
                            <Link to='#admin'>
                                Admin {' '} <i className='fa fa-caret-down'/>
                            </Link>
                            <ul className='dropdown-content'>
                                <li>
                                    <Link to='/dashboard'>Dashboard</Link>
                                </li>
                                <li>
                                    <Link to='/productlist'>Products</Link>
                                </li>
                                <li>
                                    <Link to='/orderlist'>Orders</Link>
                                </li>
                                <li>
                                    <Link to='/userlist'>Users</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

export default Navbar
