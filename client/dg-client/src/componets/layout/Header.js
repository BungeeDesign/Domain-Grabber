import React from 'react';
import logo from '../../assets/Logo.svg';

const Header = props => {
    return (
        <div>
            <header>
                <img src={logo} alt="Domain Grabber Logo"/>
            </header>
        </div>
    );
};

export default Header;
