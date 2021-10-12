import Axios from 'axios';

import {
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_IN_PROGRESS,
    ORDER_PAY_REQUEST,ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";
import {CONFIRM_MPESA_PAYMENT,} from "../constants/paymentConstants";

export const payOrderStripe = (order, paymentIntent) => async  (dispatch, getState) => {
    dispatch({type: ORDER_PAY_REQUEST, payload: {order, paymentIntent}});
    const {user : {userInfo},} = getState();
    try {
        const {data} = await Axios.put(`/api/payment/stripe/${order._id}/pay`, paymentIntent, {
            headers :{
                Authorization: `Bearer ${userInfo.token}`
            },
        });
        dispatch({type: ORDER_PAY_SUCCESS, payload: data})
    } catch (error) {
        const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

        dispatch({type: ORDER_DETAILS_FAIL, payload: message});
    }
}

/* export const payOrderMpesa = (order, mpesaPhoneNumber) => async  (dispatch, getState) => {
    dispatch({type: ORDER_PAY_REQUEST, payload: {order, mpesaPhoneNumber}});
    const {user : {userInfo},} = getState();
    try {
        const {data} = await Axios.post(`/api/payment/mpesa/${order._id}/pay`, {
            mpesaPhoneNumber,
            mpesaAmount: order.totalPrice,
        }, {
            headers :{
                Authorization: `Bearer ${userInfo.token}`
            },
        });
        //Todo: Create a new Type of Action to dispatch (ORDER_PAY_IN_PROGRESS) 
        dispatch({type: ORDER_PAY_SUCCESS, payload: data})
    } catch (error) {
        const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

        dispatch({type: ORDER_DETAILS_FAIL, payload: message});
    }
} */

export const initiateMpesaPayment = (order, mpesaPhoneNumber) => async (dispatch, getState) =>{
    dispatch({type: ORDER_PAY_REQUEST, payload: {order, mpesaPhoneNumber}});
    //dispatch({type: ORDER_PAY_IN_PROGRESS, payload: {order, mpesaPhoneNumber}});
    const {user : {userInfo},} = getState();

    try {
        console.log(`inside initiate mpesa`)
        const {data} = await Axios.post(`/api/payment/mpesa/${order._id}/pay`, {mpesaPhoneNumber}, {
            headers :{
                Authorization: `Bearer ${userInfo.token}`
            },
        });
        console.log('after response from initiate mpesa')
        dispatch({type:ORDER_PAY_IN_PROGRESS, payload: data})
        
    } catch (error) {
        const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

        dispatch({type: ORDER_PAY_FAIL, payload: message});
    }
}

export const confirmMpesaOrderPayment = (order) => async (dispatch, getState) => {
    //Todo: add a reducer for the below action
    dispatch({type: CONFIRM_MPESA_PAYMENT, payload: order,});
    const {user : {userInfo},} = getState();

    try {
        const {data} = await Axios.get(`/api/orders/${order._id}`, {
            headers :{
                Authorization: `Bearer ${userInfo.token}`
            },
        });
        console.log('inside confirmMpesaOrderPayment')
        console.log(data.paymentResult.status)
        console.log(data.mpesaInfo.isPayInProgress)
        
        if(data.mpesaInfo.isPayInProgress){ //Alternatively - .id
            dispatch({type:ORDER_PAY_IN_PROGRESS, payload: data})
        } else{
            if(data.paymentResult.status){
                dispatch({type: ORDER_PAY_SUCCESS, payload: data})
            } else{
                dispatch({type: ORDER_PAY_FAIL, payload: data.mpesaInfo.mpesaCustomerMessage})
            }
        }
    } catch (error) {
        const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
        console.log(`error occured: ${error}`)
        dispatch({type: ORDER_PAY_FAIL, payload: message});
    }
}