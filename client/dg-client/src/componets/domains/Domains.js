import React, { useContext } from 'react';
import Loader from '../loaders/Loader';
import DomainItem from '../domains/DomainItem'
import DomainContext from '../../context/domainContext';

const Domains = () => {
    const domainContext = useContext(DomainContext);
    let { loading, domains, domainName, noResults } = domainContext;
    
    const domainCount = domains.length;

    if (loading) return <Loader />;

    return (
        <div className="domain-results">
          {noResults === true && <div className="domain-count">No results for: {domainName}</div>}
          {domainCount > 0 && <div className="domain-count">Found: {domainCount} Domains!</div>}
                {domains.map(domain => (
                  <DomainItem key={domain.key} domain={domain.domain} screenshot={domain.screenshot} domainName={domainName} />
                ))}
        </div>
    );
};

export default Domains;
