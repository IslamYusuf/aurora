import Axios from 'axios';

import {
    ORDER_DETAILS_FAIL, ORDER_PAY_FAIL,
    ORDER_PAY_IN_PROGRESS, ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";
import { CONFIRM_MPESA_PAYMENT, } from "../constants/paymentConstants";

export const payOrderStripe = (order, paymentIntent) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentIntent } });
    const { user: { userInfo }, } = getState();
    try {
        const { data } = await Axios.put(`/api/payment/stripe/${order._id}/pay`, paymentIntent, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data })
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        dispatch({ type: ORDER_DETAILS_FAIL, payload: message });
    }
}

export const initiateMpesaPayment = (order, mpesaPhoneNumber) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, mpesaPhoneNumber } });
    const { user: { userInfo }, } = getState();

    try {
        const { data } = await Axios.post(`/api/payment/mpesa/${order._id}/pay`, { mpesaPhoneNumber }, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });
        dispatch({ type: ORDER_PAY_IN_PROGRESS, payload: data })
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
}

export const confirmMpesaOrderPayment = (order) => async (dispatch, getState) => {
    dispatch({ type: CONFIRM_MPESA_PAYMENT, payload: order, });
    const { user: { userInfo }, } = getState();

    try {
        const { data } = await Axios.get(`/api/orders/${order._id}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        if (data.mpesaInfo.isPayInProgress) {
            dispatch({ type: ORDER_PAY_IN_PROGRESS, payload: data })
        } else {
            if (data.paymentResult.status) {
                dispatch({ type: ORDER_PAY_SUCCESS, payload: data })
            } else {
                dispatch({ type: ORDER_PAY_FAIL, payload: data.mpesaInfo.mpesaCustomerMessage })
            }
        }
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
}