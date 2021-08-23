import Axios from 'axios';

import {
    ORDER_CREATE_FAIL,ORDER_CREATE_REQUEST,ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_REQUEST,ORDER_DETAILS_FAIL,ORDER_DETAILS_SUCCESS,
    ORDER_PAY_REQUEST,ORDER_PAY_SUCCESS,ORDER_LIST_REQUEST,
    ORDER_LIST_FAIL,ORDER_LIST_SUCCESS,ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,ORDER_DELETE_FAIL,ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,ORDER_DELIVER_FAIL, ORDER_SUMMARY_REQUEST, ORDER_SUMMARY_SUCCESS, ORDER_SUMMARY_FAIL,
} from "../constants/orderConstants";
import {CART_EMPTY} from '../constants/cartConstants';

export const createOrder = (order) => async (dispatch, getState) => {
    dispatch({type: ORDER_CREATE_REQUEST, payload: order});
    
    try {
        const { user:{userInfo}} = getState();
        const {data} = await Axios.post('/api/orders', order, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        })
        dispatch({type: ORDER_CREATE_SUCCESS, payload: data.order})
        dispatch({type: CART_EMPTY})
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
}

export const detailsOrder = (orderId) => async  (dispatch, getState) => {
    dispatch({type: ORDER_DETAILS_REQUEST, payload: orderId});
    const {user : {userInfo},} = getState();
    try {
        const {data} = await Axios.get(`/api/orders/${orderId}`, {
            headers :{
                Authorization: `Bearer ${userInfo.token}` 
            },
        });
        dispatch({type: ORDER_DETAILS_SUCCESS, payload: data})
    } catch (error) {
        const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

        dispatch({type: ORDER_DETAILS_FAIL, payload: message});
    }

}
export const payOrder = (order, paymentResult) => async  (dispatch, getState) => {
    dispatch({type: ORDER_PAY_REQUEST, payload: {order, paymentResult}});
    const {user : {userInfo},} = getState();
    try {
        const {data} = await Axios.put(`/api/orders/${order._id}/pay`, paymentResult, {
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

export const listOrders = () => async (dispatch, getState) => {
    dispatch({type: ORDER_LIST_REQUEST})
    const {user:{userInfo}} = getState();
    try {
        const {data} = await Axios.get('/api/orders/list', {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch({type: ORDER_LIST_SUCCESS, payload: data})
    } catch (error) {
        const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
        dispatch({type: ORDER_LIST_FAIL, payload: message})
    }
}

export const listAllOrders = () => async (dispatch, getState) => {
    dispatch({ type: ORDER_LIST_REQUEST });
    const {user: { userInfo },} = getState();
    try {
      const { data } = await Axios.get(`/api/orders/`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      console.log(data);
      dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_LIST_FAIL, payload: message });
    }
};

export const deleteOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
    const {user: { userInfo },} = getState();
    try {
      const { data } = Axios.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_DELETE_FAIL, payload: message });
    }
};
  
export const deliverOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
    const {
      user: { userInfo },
    } = getState();
    try {
      const { data } = Axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
    }
};

export const summaryOrder = () => async (dispatch, getState) => {
  dispatch({ type: ORDER_SUMMARY_REQUEST });
  const {user: { userInfo },} = getState();
  try {
    const { data } = await Axios.get('/api/orders/summary', {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: ORDER_SUMMARY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_SUMMARY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};