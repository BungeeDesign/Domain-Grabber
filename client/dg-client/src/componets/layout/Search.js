import React, { useState, useContext, Fragment } from 'react';
import DomainContext from '../../context/domainContext';
import Toggle from './Toggle';

const Search = () => {
    const domainContext = useContext(DomainContext);

    const [data, setData] = useState([{
        "domain": null,
        "level": "1",
        "screenshot": false,
        "analysis": false,
        "probe": false,
        "action": "list"
    }]);

    // Toggle Settings
    const [toggles, setToggled] = useState([
        {
            toggled: false,
            label: 'Probe Domains' 
        },
        {
            toggled: false,
            label: 'Take Screenshots' 
        },
        {
            toggled: false,
            label: 'Domain Analysis' 
        }]);

    // Submit Search
    const onClick = () => {
        if (data === '') {
            console.log('Cannot be empty');
        } else {
            domainContext.searchDomains(data);
        }
    };

    const onChange = e => {
        const temporayData = [...data];
        temporayData[0].domain = e.target.value;
        setData(temporayData);
    };

    const onToggle = (index) => {
        const temporaryToggles = [...toggles];
        temporaryToggles[index].toggled = !temporaryToggles[index].toggled;
        temporaryToggles[index].label = temporaryToggles[index].label;
        setToggled(temporaryToggles);

        const temporayData = [...data];
        if (temporaryToggles[index].label === 'Probe Domains') {
            temporayData[0].probe = temporaryToggles[index].toggled;
        }

        if (temporaryToggles[index].label === 'Take Screenshots') {
            temporayData[0].screenshot = temporaryToggles[index].toggled;
        }

        if (temporaryToggles[index].label === 'Domain Analysis') {
            temporayData[0].analysis = temporaryToggles[index].toggled;
        }
        setData(temporayData);
    }

    return (
        <div className="search-container">
            <input type="text" placeholder="Google.com" onChange={onChange}/>
            <div className="search-settings">
                {toggles.map((toggle, i) => (
                    <Toggle toggleLabel={toggle.label} toggle={toggle.toggled} handleToggle={() => onToggle(i)}/>
                ))}
            </div>
            <button onClick={onClick}>Grab</button>
        </div>
    );
};

export default Search;
