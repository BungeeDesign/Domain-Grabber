import React, { useContext, Fragment } from 'react';
import Loader from '../loaders/Loader';
import DomainContext from '../../context/domainContext';

const Search = () => {
    const domainContext = useContext(DomainContext);
    const { loading, domains } = domainContext;

    if (loading) return <Loader />;

    return (
        <div className="domain-results">
            <h2>Nothing here yet 😀</h2>
        </div>
    );
};

// Header.propTypes = {

// };

export default Search;
