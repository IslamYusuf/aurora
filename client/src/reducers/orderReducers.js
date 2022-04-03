import {
  ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS, ORDER_LIST_FAIL, ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS, ORDER_PAY_FAIL, ORDER_PAY_REQUEST,
  ORDER_PAY_RESET, ORDER_PAY_SUCCESS, ORDER_DELETE_REQUEST,
  ORDER_DELETE_SUCCESS, ORDER_DELETE_FAIL, ORDER_DELIVER_REQUEST,
  ORDER_DELETE_RESET, ORDER_DELIVER_SUCCESS, ORDER_DELIVER_FAIL,
  ORDER_DELIVER_RESET, ORDER_SUMMARY_REQUEST, ORDER_SUMMARY_SUCCESS,
  ORDER_SUMMARY_FAIL, ORDER_PAY_IN_PROGRESS, ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS, ORDER_UPDATE_FAIL,
} from "../constants/orderConstants";
import { CONFIRM_MPESA_PAYMENT } from "../constants/paymentConstants";

export const order = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true }
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
}
export const orderDetails = (state = { loading: true, order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
    case ORDER_UPDATE_REQUEST:
      return { loading: true }
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload }
    case ORDER_UPDATE_SUCCESS:
      return { ...state, order: action.payload }
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case ORDER_UPDATE_FAIL:
      return { ...state, paymentUpdateError: action.payload }
    default:
      return state;
  }
}
export const orderPayment = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return { loading: true }
    case ORDER_PAY_IN_PROGRESS:
      return {
        loading: false, pending: true,
        message: action.payload.mpesaInfo.mpesaCustomerMessage
      }
    case CONFIRM_MPESA_PAYMENT:
      return { loading: true, pending: true, }
    case ORDER_PAY_SUCCESS:
      return { loading: false, success: true, pending: false }
    case ORDER_PAY_FAIL:
      return { loading: false, error: action.payload }
    case ORDER_PAY_RESET:
      return {}
    default:
      return state;
  }
}
export const orderList = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true }
    case ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload }
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state;
  }
}

export const orderDelete = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELETE_REQUEST:
      return { loading: true };
    case ORDER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ORDER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_DELETE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDeliver = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELIVER_REQUEST:
      return { loading: true };
    case ORDER_DELIVER_SUCCESS:
      return { loading: false, success: true };
    case ORDER_DELIVER_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_DELIVER_RESET:
      return {};
    default:
      return state;
  }
};

export const orderSummary = (state = { loading: true, summary: {} }, action) => {
  switch (action.type) {
    case ORDER_SUMMARY_REQUEST:
      return { loading: true };
    case ORDER_SUMMARY_SUCCESS:
      return { loading: false, summary: action.payload };
    case ORDER_SUMMARY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};