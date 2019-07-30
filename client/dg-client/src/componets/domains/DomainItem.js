import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DomainHighlighter from './DomainHighlighter';
import Zoom from 'react-reveal/Zoom';

const DomainItem = ({domain, domainName}) => {
    let replacedDomain = domain.replace(domainName, '');
    let formattedDomain = replacedDomain.replace('www.', '');
    let subDomains = formattedDomain.split('.');

    console.log(subDomains);

    return (
        <>
            <Zoom>
            <div className='domain-item'>
                <div className='domain-name'>
                {subDomains.map(subDomain => (<DomainHighlighter key={subDomain.id} subDomain={subDomain} />))}
                .{domainName}
                </div>
            </div>
            </Zoom>
        </>
    );
};

// DomainItem.propTypes = {
//   domain: PropTypes.string.isRequired
// };

export default DomainItem;