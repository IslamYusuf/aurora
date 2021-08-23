import Axios from 'axios';
import { CART_LOAD_ITEMS, CART_SAVE_ITEMS, CART_REMOVE_SHIPPING_ADDRESS, CART_ADD_ITEM } from '../constants/cartConstants';
import {
    USER_DETAILS_FAIL,USER_DETAILS_REQUEST,USER_DETAILS_SUCCESS,
    USER_SIGNIN_FAIL,USER_SIGNIN_REQUEST,USER_SIGNIN_SUCCESS,
    USER_SIGNOUT,USER_SIGNUP_FAIL,USER_SIGNUP_REQUEST,
    USER_SIGNUP_SUCCESS,USER_UPDATE_PROFILE_FAIL,USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,USER_LIST_REQUEST,USER_LIST_SUCCESS,
    USER_LIST_FAIL,USER_DELETE_REQUEST,USER_DELETE_SUCCESS,USER_DELETE_FAIL,
    USER_UPDATE_SUCCESS,USER_UPDATE_FAIL
} from '../constants/userConstants';

export const signin = (email, password) => async (dispatch, getState) =>{
    dispatch({type: USER_SIGNIN_REQUEST, payload: {email, password}});
    try {
        const {data} = await Axios.post('/api/users/signin', {email, password});
        const savedCartItems = data.cartItems;
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        if(savedCartItems) for(let i=0; i < savedCartItems.length; ++i) dispatch({type:CART_ADD_ITEM, payload:savedCartItems[i]});
        const {cart:{cartItems}} = getState();
        localStorage.setItem('cartItems',JSON.stringify(cartItems));
    } catch (e) {
        dispatch({type: USER_SIGNIN_FAIL,
            payload: e.response && e.response.data.message
            ? e.response.data.message
            : e.message})
    }
}
export const signup = (name, email, password) => async (dispatch) =>{
    dispatch({type: USER_SIGNUP_REQUEST, payload: {email, password}});

    try {
        const {data} = await Axios.post('/api/users/signup', {name, email, password});
        dispatch({type: USER_SIGNUP_SUCCESS, payload: data});
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (e) {
        dispatch({type: USER_SIGNUP_FAIL,
            payload: e.response && e.response.data.message
            ? e.response.data.message
            : e.message})
    }
}

export const signout = () => async (dispatch, getState) =>{
    const {cart:{cartItems},user:{userInfo}} = getState();
    const email = userInfo.email;
    const {data} = await Axios.post('api/users/signout', {email, cartItems});
    dispatch({type: CART_SAVE_ITEMS, payload:data})
    dispatch({type:CART_REMOVE_SHIPPING_ADDRESS})
    dispatch({type: USER_SIGNOUT});
}

export const userDetails = (userId) => async (dispatch, getState) => {
    dispatch({type: USER_DETAILS_REQUEST, payload: userId});
    const {user:{userInfo}} = getState();

    try {
        const {data} = await Axios.get(`/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch({type: USER_DETAILS_SUCCESS, payload: data})
    } catch (e) {
        const message = e.response && e.response.data.message
        ? e.response.data.message
        : e.message;
        dispatch({type: USER_DETAILS_FAIL, payload: message})
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({type: USER_UPDATE_PROFILE_REQUEST, payload: user});
    const {user:{userInfo}} = getState();

    try {
        const {data} = await Axios.put(`/api/users/profile`, user, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        });
        dispatch({type: USER_UPDATE_PROFILE_SUCCESS, payload: data});
        dispatch({type: USER_SIGNIN_SUCCESS, payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (e) {
        const message = e.response && e.response.data.message
        ? e.response.data.message
        : e.message;
        dispatch({type: USER_UPDATE_PROFILE_FAIL, payload: message})
    }
}

export const updateUser = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const {
    user: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/users/${user._id}`, user, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPDATE_FAIL, payload: message });
  }
};

export const listUsers = () => async (dispatch, getState) => {
    dispatch({ type: USER_LIST_REQUEST });
    try {
      const {user: { userInfo },} = getState();
      const { data } = await Axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: USER_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_LIST_FAIL, payload: message });
    }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DELETE_REQUEST, payload: userId });
    const {user: { userInfo },} = getState();
    try {
      const { data } = await Axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: USER_DELETE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: USER_DELETE_FAIL, payload: message });
    }
};



