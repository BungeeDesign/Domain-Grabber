import React, { useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import Loader from '../loaders/Loader';
import DomainContext from '../../context/domainContext';

const Search = props => {
    const domainContext = useContext(DomainContext);
    const { loading } = domainContext;

    if (loading) return <Loader />;

    return (
        <div className="search-container">
            <input type="text" placeholder="Google.com"/>
            <button>Grab</button>
        </div>
    );
};

// Header.propTypes = {

// };

export default Search;
