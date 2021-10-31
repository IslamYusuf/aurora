import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHistory, useLocation, Link } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
    Avatar, Button, TextField, 
    Grid, Box, Typography, Container,
} from '@material-ui/core';

import { signin } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';
import useStyles from './styles';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link to='/'>
      BinAthman Supermarket
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
    const classes = useStyles();
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
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {loading && <Loading/>}
        {error && <Message variant="danger">{error}</Message>}
        <form className={classes.form} onSubmit={submitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            inputProps={{maxLength: 40}}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputProps={{maxLength: 35}}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link to="/signup" >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}