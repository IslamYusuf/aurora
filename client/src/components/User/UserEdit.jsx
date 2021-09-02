import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import {useParams} from 'react-router-dom'
import {
    Button, CssBaseline, TextField, 
    Grid, Typography, Container, Checkbox, FormControlLabel,
} from '@material-ui/core';

import { userDetails, updateUser } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';
import { USER_UPDATE_RESET } from '../../constants/userConstants';
import useStyles from './styles';

const UserEdit = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const userId = props.match.params.id;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { loading, error, user } = useSelector((state) => state.userDetails);
    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = userUpdate;

    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch update user
        dispatch(updateUser({ _id: userId, firstName, lastName, email, isAdmin }));
    };
    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            props.history.push('/userlist');
        }
        if (!user) {
            dispatch(userDetails(userId));
        } else {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [dispatch, props.history, successUpdate, user, userId]);
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Edit User {`${firstName} ${lastName}`}
                    {loadingUpdate && <Loading/>}
                    {errorUpdate && <Message variant="danger">{error}</Message>}
                </Typography>
                {loading && <Loading/>}
                {error && <Message variant="danger">{error}</Message>}
                <form className={classes.form} onSubmit={submitHandler}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="firstName"
                            variant="outlined"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            value={firstName}
                            autoFocus
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent='flex-start'>
                    <Grid item>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                color="primary"
                            />
                            }
                            label="Is Admin"
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
                    Update
                </Button>
                </form>
            </div>
    </Container>
    );
}

export default UserEdit
