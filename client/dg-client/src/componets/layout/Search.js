import React, { useState, useEffect, useContext } from 'react';
import DomainContext from '../../context/domainContext';
import Toggle from './Toggle';
import Alert from './Alert';

const Search = () => {
    // Mouted or Updated
    useEffect(() => {
        if (alert.showAlert) {
            setTimeout(() => {
                const tempAlert = [...alert];
                tempAlert.showAlert = false;
                tempAlert.message = '';
                setAlert(tempAlert);
            }, 4000)
        }
    });

    const domainContext = useContext(DomainContext);

    const [data, setData] = useState([{
        "domain": '',
        "level": "1",
        "screenshot": false,
        "analysis": false,
        "probe": false,
        "action": "list"
    }]);

    // Alert State
    const [alert, setAlert] = useState([{
        showAlert: false,
        message: ''
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
        if (data[0].domain === '') {
            console.log('EMpty');
            const tempAlert = [...alert];
            tempAlert.showAlert = true;
            tempAlert.message = 'Please enter a domain to search.';
            setAlert(tempAlert);
        } else {
            if (data[0].screenshot) {
                const tempAlert = [...alert];
                tempAlert.showAlert = true;
                tempAlert.message = 'Screenshots may take a long time.';
                setAlert(tempAlert);
            }
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
            <Alert showAlert={alert.showAlert} message={alert.message} />
        </div>
    );
};

export default Search;
