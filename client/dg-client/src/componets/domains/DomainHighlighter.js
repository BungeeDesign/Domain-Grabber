import React, { useContext } from 'react';
import Loader from '../loaders/Loader';

const DomainHighlighter = ({subDomain}) => {
    return (
        <div className="sb-highlight">{subDomain}</div>
    );
};

export default DomainHighlighter;
