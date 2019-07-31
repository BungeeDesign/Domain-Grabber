import React from 'react'
import {useTransition, animated} from 'react-spring';

const Alert = ({showAlert, message}) => {
    
    const transitions = useTransition(showAlert, null, {
        from: { opacity: 0, transform: 'translateY(25px)' },
        enter: { opacity: 1, transform: 'translateY(0px)'},
        leave: { opacity: 0, transform: 'translateY(25px)'},
        config: {mass: 1, tension: 200}
    });

    return transitions.map(({ item, key, props }) =>
        item && 
        <animated.div key={key} style={props}>
        <div className="alert-container">
            <h3>🚧 {message}</h3>
        </div>
        </animated.div>
        
    )
}

export default Alert
