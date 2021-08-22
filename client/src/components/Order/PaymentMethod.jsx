import { useState } from 'react';
import { useDispatch, useSelector,  } from 'react-redux';
import {useHistory} from 'react-router-dom';

import { savePaymentMethod } from '../../actions/cartActions';
import CheckoutSteps from '../Cart/CheckoutSteps';

const PaymentMethod = () => {
    const history = useHistory();
    const {shippingAddress} = useSelector(state => state.cart)

    if(!shippingAddress.address){
        history.push('/shipping');
    }
    const [paymentMethod, setPaymentMethod] = useState('Paypal');
    const dispatch = useDispatch();

    const submitHandler = (e) =>{
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form className='form' onSubmit={submitHandler} >
                <div>
                    <h1>Payment Method</h1>
                </div>
                {/* Combine the two div elements below */}
                <div>
                    <div>
                        <input
                            type='radio'
                            id='paypal'
                            value='PayPal'
                            name='paymentMethod'
                            required
                            checked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor='paypal'>PayPal</label>
                    </div>
                </div>
                <div>
                    <div>
                        <input
                            type='radio'
                            id='stripe'
                            value='Stripe'
                            name='paymentMethod'
                            required
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor='stripe'>Stripe</label>
                    </div>
                </div>
                <div>
                    <button className='primary' type='submit'>Next</button>
                </div>

            </form>
        </div>
    )
}

export default PaymentMethod
