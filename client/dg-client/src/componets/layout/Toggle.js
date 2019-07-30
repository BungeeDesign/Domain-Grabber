import React, { useState } from 'react';

const Toggle = ({toggleLabel, handleToggle, toggle}) => {
    // const [toggle, setToggle] = useState(false);

    // const onClick = () => {
    //     setToggle(!toggle);
    // }

    return (
        <div className="toggle">
            <div className="toggle-label">{toggleLabel}</div>
            <div className={`toggle-container ${toggle ? 'container-toggled' : ''}`}>
                <div onClick={handleToggle} className={`${toggleLabel} toggle-button ${toggle ? 'toggled' : ''}`}></div>
            </div>
        </div>
    );
};

export default Toggle;
