import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';


import { 
    products, product, productCreate,
    productDelete, productUpdate, 
} from './reducers/productReducers';
import { cart } from './reducers/cartReducers';


import {
    user, userDetails, updatedUserProfile,
    userDelete, userList, userUpdate
} from './reducers/userReducers';

import { order,orderDetails,orderPayment,
    orderList, orderDelete, orderSummary, orderDeliver,
} from './reducers/orderReducers';

const initialState = {
    user :{
        userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    },
    cart :{
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod : 'Stripe',
    }
}

const reducer = combineReducers({
    products,
    product,
    productCreate,
    productDelete,
    productUpdate,
    cart,
    user,
    userList,
    userDelete,
    userUpdate,
    order,
    orderDetails,
    orderPayment,
    orderList,
    orderDelete,
    orderSummary,
    orderDeliver,
    userDetails,
    updatedUserProfile,
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));


export default store;
