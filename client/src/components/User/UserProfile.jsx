import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button, TextField, Grid, Typography, Container,
} from '@material-ui/core';

import { updateUserProfile, userDetails } from '../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import Loading from '../Loading';
import Message from '../Message';
import useStyles from './styles'

const UserProfile1 = () => {
    const classes = useStyles();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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
            if(userInfo.email !== user.email){
                dispatch(userDetails(userInfo._id));
            }
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setEmail(user.email)
        }
    }, [dispatch, userInfo._id, user, userInfo.email])

    const submitHandler = (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Password and confirm Password don't match")
        } else {
            dispatch(updateUserProfile({userId: user._id, firstName, lastName, email, password}))
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
            <Typography component="h1" variant="h5" gutterBottom>
                User Profile
            </Typography>
            {
                loading ? <Loading />
                : error ? <Message variant='danger'>{error}</Message>
                : <>
                    {loadingUpdate && <Loading />}
                        {errorUpdate && <Message variant='danger' >{errorUpdate}</Message>}
                        {success && <Message variant='success' >Profile Updated Succesfully</Message>}
                    <form className={classes.form} onSubmit={submitHandler}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="firstName"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                id="firstName"
                                label="First Name"
                                value={firstName}
                                inputProps={{maxLength: 20}}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                value={lastName}
                                inputProps={{maxLength: 20}}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                type="email"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={email}
                                disabled={userInfo.isAdmin}
                                inputProps={{maxLength: 40}}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                title="Password must be at least 6 characters long and
                                    should contain a lowercase letter, uppercase and 
                                    a digit."
                                inputProps={{maxLength: 35}}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                title="Password must be at least 6 characters long and
                                    should contain a lowercase letter, uppercase and 
                                    a digit."
                                inputProps={{maxLength: 35}}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Update Profile
                    </Button>
                </form>
                </>                
            }
            </div>
        </Container>
    )
}

export default UserProfile1
