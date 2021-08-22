import React, { useEffect } from 'react'
import { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'

import { updateUserProfile, userDetails } from '../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import Loading from '../Loading';
import Message from '../Message';

const UserProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {userInfo} = useSelector(state => state.user)
    const {loading, error, user} = useSelector(state => state.userDetails); 
    const {success, loading: loadingUpdate, error: errorUpdate} = useSelector(state => state.updatedUserProfile)
    const dispatch = useDispatch();

    useEffect(() => {
        if(!user){
            dispatch({type: USER_UPDATE_PROFILE_RESET});
            dispatch(userDetails(userInfo._id))
        } else {
            setName(user.name)
            setEmail(user.email)
        }
    }, [dispatch, userInfo._id, user])

    const submitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Password and confirm Password don't match")
        } else {
            dispatch(updateUserProfile({userId: user._id, name, email, password}))
        }
    }   

    return (
        <div>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    loading ? <Loading />
                    : error ? <Message variant='danger'>{error}</Message>
                    : <>
                        {loadingUpdate && <Loading />}
                        {errorUpdate && <Message variant='danger' >{errorUpdate}</Message>}
                        {success && <Message variant='success' >Profile Updated Succesfully</Message>}
                        <div>
                            <label htmlFor='name'>Name</label>
                            <input
                                id='name'
                                type='text'
                                placehoder='Enter name'
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor='email'>Email</label>
                            <input
                                id='email'
                                type='email'
                                placehoder='Enter email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor='password'>Password</label>
                            <input
                                id='password'
                                type='password'
                                placehoder='Enter password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor='confrimPassword'>confrim password</label>
                            <input
                                id='confrimPassword'
                                type='password'
                                placehoder='Enter confrim password'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label/>
                            <button className='primary' type='submit'>Update</button>
                        </div>
                    </>
                }
            </form>
        </div>
    )
}

export default UserProfile
