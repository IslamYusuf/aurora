import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
    Button, TextField, Grid,
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
    
    const {shippingAddress, paymentMethod:payment} = useSelector(state => state.cart)
    const [paymentMethod, setPaymentMethod] = useState(payment);
    const [firstName, setFirstName] = useState(shippingAddress.fullName 
        ? shippingAddress.fullName.split(' ')[0]
        : '');
    const [lastName, setLastName] = useState(shippingAddress.fullName 
        ? shippingAddress.fullName.split(' ')[1]
        : '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    const dispatch = useDispatch();

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(saveShippingAddress({fullName:`${firstName} ${lastName}`, address, city, postalCode, country}));
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder')
    };
    return (
        <>
            <CheckoutSteps step1 step2/>
            <Container component='main' maxWidth='xs' className={classes.container}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        Shipping and Payment Information
                    </Typography>
                    <form className={classes.form} onSubmit={submitHandler}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="firstName" variant="outlined" required
                                    fullWidth id="firstName" label="First Name" autoFocus
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"required fullWidth value={lastName}
                                    id="lastName"label="Last Name"name="lastName"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined" required fullWidth value={address}
                                    id="address" label="Address" name="address"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined" required fullWidth
                                    name="city" label="City" id="city" value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined" required fullWidth value={postalCode}
                                    id="postalCode" label="Postal Code" name="postalCode"
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined" required fullWidth value={country}
                                    name="country" label="Country" id="country"
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <label/>
                        <Divider style={{marginTop:'15px', marginBottom:'15px',}}/>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Payment Method</FormLabel>
                            <RadioGroup aria-label="payment" name="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" />
                                <FormControlLabel value="Paypal" control={<Radio />} label="Paypal" />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit" fullWidth variant="contained" 
                            color="primary" className={classes.submit}
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
