import React, { useState, useContext, Fragment } from 'react';
import DomainContext from '../../context/domainContext';

const Search = () => {
    const domainContext = useContext(DomainContext);

    const [data, setData] = useState('');

    // Submit Search
    const onClick = () => {
        if (data === '') {
            console.log('Cannot be empty');
        } else {
            domainContext.searchDomains(data);
        }
    };

    const onChange = e => {
        setData({
            "domain": e.target.value,
            "level": "1",
            "screenshot": "false",
            "analysis": "true",
            "probe": true,
            "action": "list"
        });
    };

    return (
        <div className="search-container">
            <input type="text" placeholder="Google.com" onChange={onChange}/>
            <button onClick={onClick}>Grab</button>
        </div>
    );
};

export default Search;
