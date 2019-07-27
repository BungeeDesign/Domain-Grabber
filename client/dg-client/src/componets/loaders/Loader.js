import React, { Fragment, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

const Search = () => {
    useEffect(() => {
        anime({
            targets: '.loader-circle',
            duration: 1800,
            delay(el, index) {
                return index * 400;
            },
            easing: 'easeOutExpo',
            opacity: 0,
            scale: '1.5',
            loop: true,
            autoplay: true
        });
    }, []);

    return (
        <Fragment>
            <div className="loader-container">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
            </div>
        </Fragment>
    );
};

export default Search;
