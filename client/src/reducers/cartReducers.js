import { CART_ADD_ITEM,
        CART_EMPTY, 
        CART_REMOVE_ITEM, 
        CART_SAVE_PAYMENT_METHOD, 
        CART_SAVE_SHIPPING_ADDRESS,
        CART_SAVE_ITEMS, 
        CART_LOAD_ITEMS,
        CART_REMOVE_SHIPPING_ADDRESS} from "../constants/cartConstants";

export const cart = (state = { cartItems:[]}, action) =>{
    switch(action.type){
        case CART_ADD_ITEM:
            const item = action.payload;
            const existItem = state.cartItems.find(i => i.product === item.product)
            if(existItem){
                return {
                    ...state, 
                    cartItems: state.cartItems.map(i => i.product === existItem.product ? item : i)}
            } else {
                return {...state, cartItems: [...state.cartItems, item]}
            }
        case CART_LOAD_ITEMS:
            return {...state, cartItems: action.payload}
        case CART_REMOVE_ITEM:
            return {...state, cartItems:state.cartItems.filter(p => p.product !== action.payload),};
        case CART_SAVE_SHIPPING_ADDRESS:
            return {...state, shippingAddress: action.payload};
        case CART_REMOVE_SHIPPING_ADDRESS:
            return {...state, shippingAddress:{}};
        case CART_SAVE_PAYMENT_METHOD:
            return {...state, paymentMethod: action.payload};
        case CART_EMPTY:
        case CART_SAVE_ITEMS:
            localStorage.removeItem('cartItems');
            return {...state, cartItems: []};
        default:
            return state;
    }
}