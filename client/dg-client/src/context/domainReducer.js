import {
    SEARCH_DOMAINS,
    SET_LOADING,
  } from './types';

  export default (state, action) => {
    switch (action.type) {
        case SEARCH_DOMAINS:
          return {
            ...state,
            domains: action.payload,
            loading: false
          };
        case SET_LOADING:
          return {
            ...state,
            loading: true
          };
        default:
          return state;
      }
  }