import {
    USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, 
    USER_SIGNIN_FAIL, USER_SIGNIN_REQUEST, USER_SIGNIN_SUCCESS, 
    USER_SIGNOUT, USER_SIGNUP_FAIL, USER_SIGNUP_REQUEST, 
    USER_SIGNUP_SUCCESS, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, 
    USER_UPDATE_PROFILE_RESET, USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_REQUEST,USER_UPDATE_RESET,USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,USER_LIST_FAIL,USER_LIST_REQUEST,
    USER_LIST_SUCCESS,USER_DELETE_FAIL,USER_DELETE_REQUEST,
    USER_DELETE_RESET,USER_DELETE_SUCCESS,USER_DETAILS_RESET
} from "../constants/userConstants";

export const user = (state={}, action) =>{
    switch (action.type) {
        case USER_SIGNIN_REQUEST:
        case USER_SIGNUP_REQUEST:
            return {loading : true};
        case USER_SIGNIN_SUCCESS:
        case USER_SIGNUP_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_SIGNIN_FAIL:
        case USER_SIGNUP_FAIL:
            return {loading: false, error: action.payload};
        case USER_SIGNOUT:
            localStorage.removeItem('userInfo');
            localStorage.removeItem('shippingAddress');
            return {};
        default:
            return state;
    }
}
export const userDetails = (state={loading: true}, action) =>{
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return {loading : true};
        case USER_DETAILS_SUCCESS:
            return {loading: false, user: action.payload};
        case USER_DETAILS_FAIL:
            return {loading: false, error: action.payload};
        case USER_DETAILS_RESET:
            return {loading: true,};
        default:
            return state;
    }
}

export const updatedUserProfile = (state={}, action) =>{
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return {loading : true};
        case USER_UPDATE_PROFILE_SUCCESS:
            return {loading: false, success: true};
        case USER_UPDATE_PROFILE_FAIL:
            return {loading: false, error: action.payload};
        case USER_UPDATE_PROFILE_RESET:
            return {};
        default:
            return state;
    }
}

export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_UPDATE_PROFILE_REQUEST:
        return { loading: true };
      case USER_UPDATE_PROFILE_SUCCESS:
        return { loading: false, success: true };
      case USER_UPDATE_PROFILE_FAIL:
        return { loading: false, error: action.payload };
      case USER_UPDATE_PROFILE_RESET:
        return {};
      default:
        return state;
    }
};

export const userUpdate = (state = {}, action) => {
    switch (action.type) {
      case USER_UPDATE_REQUEST:
        return { loading: true };
      case USER_UPDATE_SUCCESS:
        return { loading: false, success: true };
      case USER_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      case USER_UPDATE_RESET:
        return {};
      default:
        return state;
    }
};

export const userList= (state = { loading: true }, action) => {
    switch (action.type) {
      case USER_LIST_REQUEST:
        return { loading: true };
      case USER_LIST_SUCCESS:
        return { loading: false, users: action.payload };
      case USER_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
};

export const userDelete = (state = {}, action) => {
    switch (action.type) {
      case USER_DELETE_REQUEST:
        return { loading: true };
      case USER_DELETE_SUCCESS:
        return { loading: false, success: true };
      case USER_DELETE_FAIL:
        return { loading: false, error: action.payload };
      case USER_DELETE_RESET:
        return {};
      default:
        return state;
    }
};

