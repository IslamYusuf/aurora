import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useHistory, useLocation } from 'react-router-dom';

import { signin } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {search} = useLocation();
    const history = useHistory();

    const redirect = search ? search.split('=')[1] : '/';
    const {userInfo, loading, error} = useSelector(state => state.user);


    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }

    useEffect(() =>{
        if(userInfo){
            history.push(redirect);
        }
    }, [history, redirect, userInfo]);

    return (
        <div>
           <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Sign In</h1>
                </div>
                {loading && <Loading/>}
                {error && <Message variant="danger">{error}</Message>}   
                <div>
                    <label htmlFor="email">Email address</label>
                    <input
                    type='email'
                    id='email'
                    placeholder='Enter Email'
                    required
                    onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                    type='password'
                    id='password'
                    placeholder='Enter Password'
                    required
                    onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div>
                    <label/>
                    <button className="primary" type="submit"> Sign In</button>
                </div>
                <div>
                    <label />
                    <div>
                        New Customer? {' '}
                        <Link to={`/signup?redirect=${redirect}`}>Create your acccount</Link>
                    </div>
                </div>
            </form> 
        </div>
    )
}

export default Signin;
