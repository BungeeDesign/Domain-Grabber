import React, { useState, Fragment } from 'react';
import './App.scss';
import Header from './componets/layout/Header';
import Search from './componets/layout/Search';

const App = () => {
  return (
    // <DomainState>
        <div className="App">
          <Fragment>
            <Header />
            <Search />
          </Fragment>
        </div>
    // </DomainState>
  );
}

export default App;
