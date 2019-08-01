import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DomainHighlighter from './DomainHighlighter';
import Fade from 'react-reveal/Fade';

const DomainItem = ({domain, screenshot, domainName}) => {
    let replacedDomain = domain.replace(domainName, '');
    let formattedDomain = replacedDomain.replace('www.', '');
    let subDomains = formattedDomain.split('.');

    console.log(subDomains);

    return (
        <>
            <Fade bottom>
            <div className='domain-item'>
                <div className='domain-name'>
                {subDomains.map(subDomain => (<DomainHighlighter key={subDomain.id} subDomain={subDomain} />))}
                .{domainName}
                <img className='domain-screenshots' src={screenshot} alt="Screenshot"/>
                </div>
            </div>
            </Fade>
        </>
    );
};

// DomainItem.propTypes = {
//   domain: PropTypes.string.isRequired
// };

export default DomainItem;