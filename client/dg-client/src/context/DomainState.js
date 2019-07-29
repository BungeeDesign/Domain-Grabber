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
    domainName: '',
    loading: false
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searchDomains = async data => {
    setLoading();
    console.log(data);
    const res = await axios.post('http://localhost:8000/domain', data, {timeout: 690000});

    dispatch({
      type: SEARCH_DOMAINS,
      payload: res.data
    });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <DomainContext.Provider
      value={{
        domains: state.domains,
        domainName: state.domainName,
        loading: state.loading,
        searchDomains
      }}
    >
      {props.children}
    </DomainContext.Provider>
  );
};

export default DomainState;