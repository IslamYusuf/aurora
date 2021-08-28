import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
    Button, CssBaseline, TextField,
    Typography, Container,Divider,
    FormControl, FormLabel,RadioGroup,FormControlLabel,Radio,
} from '@material-ui/core';

import { saveShippingAddress, savePaymentMethod } from "../../actions/cartActions";
import CheckoutSteps from "../Cart/CheckoutSteps";
import useStyles from './styles';

const ShippingAddress = () => {
    const classes = useStyles();
    const history = useHistory();
    const {userInfo} = useSelector(state => state.user);
    
    if(!userInfo){
        history.push('/signin');
    }
    
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const {shippingAddress} = useSelector(state => state.cart)
    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const dispatch = useDispatch();

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(saveShippingAddress({fullName, address, city, postalCode, country}));
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder')
    };
    return (
        <>
            <CheckoutSteps step1 step2/>
            <Container component='main' maxWidth='xs'>
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Shipping and Payment Information
                    </Typography>
                    <form className={classes.form} onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="fullname"
                            label="Full Name"
                            name="fullname"
                            autoFocus
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="address"
                            label="Address"
                            id="address"
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="city"
                            label="City"
                            id="city"
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="postalCode"
                            label="Postal Code"
                            id="postalCode"
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="country"
                            label="Country"
                            id="country"
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        <Divider/>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Payment Method</FormLabel>
                            <RadioGroup aria-label="payment" name="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel value="stripe" control={<Radio />} label="Stripe" />
                                <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Place Order
                        </Button>
                    </form>
                </div>
            </Container>
        </>
    )
}

export default ShippingAddress;
