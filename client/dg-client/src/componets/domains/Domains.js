import React, { useContext } from 'react';
import Loader from '../loaders/Loader';
import DomainItem from '../domains/DomainItem'
import DomainContext from '../../context/domainContext';

const Search = () => {
    const domainContext = useContext(DomainContext);
    let { loading, domains, domainName } = domainContext;
    
    const domainCount = domains.length;

    if (loading) return <Loader />;

    return (
        <div className="domain-results">
          {domainCount > 0 && <div className="domain-count">Found: {domainCount} Domains!</div>}
                {domains.map(domain => (
                  <DomainItem key={domain.key} domain={domain.domain} domainName={domainName} />
                ))}
        </div>
    );
};

export default Search;
