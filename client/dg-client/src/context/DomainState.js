import React, { useReducer } from 'react';
import axios from 'axios';
import DomainContext from './domainContext';
import GithubReducer from './domainReducer';
import {
  SEARCH_DOMAINS,
  SET_LOADING,
} from './types';

const DomainState = props => {
  const initialState = {
    domains: [],
    loading: false
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searchDomains = async data => {
    setLoading();

    const res = await axios.get(`https://localhost:8000/domain`, data);

    dispatch({
      type: SEARCH_DOMAINS,
      payload: res.data.items
    });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <DomainContext.Provider
      value={{
        domains: state.domains,
        loading: state.loading,
        searchDomains
      }}
    >
      {props.children}
    </DomainContext.Provider>
  );
};

export default DomainState;