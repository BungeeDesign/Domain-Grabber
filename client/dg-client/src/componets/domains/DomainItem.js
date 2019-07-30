import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DomainHighlighter from './DomainHighlighter';

const DomainItem = ({domain, domainName}) => {
    let replacedDomain = domain.replace(domainName, '');
    let subDomains = replacedDomain.split('.');

    console.log(subDomains);

    return (
        <div className='domain-item'>
            <div className='domain-name'>
            {subDomains.map(subDomain => (<DomainHighlighter key={subDomain.id} subDomain={subDomain} />))}
            .{domainName}
            </div>
        </div>
    );
};

// DomainItem.propTypes = {
//   domain: PropTypes.string.isRequired
// };

export default DomainItem;