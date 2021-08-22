import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, useHistory, useLocation } from 'react-router-dom';

import { signin, signup } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';

const SigninTest = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [login, setLogin] = useState(true);

    const {search} = useLocation();
    const history = useHistory();

    const redirect = search ? search.split('=')[1] : '/';
    const {userInfo, loading, error} = useSelector(state => state.user);


    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        if(login){
            dispatch(signin(email, password));
        } else {
            if(password !== confirmPassword){
                alert("Password and confirm password don't match");
            } else {
                dispatch(signup(name, email, password));        
            }
        }
    }

    const loginToggleHandler = () => {
        setLogin(!login)
    }

    useEffect(() =>{
        if(userInfo){
            history.push(redirect);
        }
    }, [history, redirect, userInfo, search]);

    return (
        <div>
           <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>{login ? 'Sign In' : 'Sign Up'}</h1>
                </div>
                {loading && <Loading/>}
                {error && <Message variant="danger">{error}</Message>}
                {!login && (
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                        type='text'
                        id='name'
                        placeholder='Enter Name'
                        required
                        onChange={(e) => setName(e.target.value)}></input>
                    </div>
                )}
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
                {!login &&(
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Enter confirm Password'
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    </div>
                )}
                <div>
                    <label/>
                    <button className="primary" type="submit">{login ? 'Sign In' : 'Sign Up'}</button>
                </div>
                <div>
                    <label />
                    <div>
                        {login ? 'New Customer? ' : 'Already have an account? '}
                        <Link to={`/signin?redirect=${redirect}`} onClick={loginToggleHandler}>{login ? 'Create your acccount' : 'Sign In'}</Link>
                    </div>
                </div>
            </form> 
        </div>
    )
}

export default SigninTest;