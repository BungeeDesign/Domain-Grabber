import React, { Fragment } from 'react';
import './App.scss';
import Header from './componets/layout/Header';
import Search from './componets/layout/Search';
import Domains from './componets/domains/Domains';
import DomainState from './context/DomainState';

const App = () => {
  return (
    <DomainState>
        <div className="App">
          <Fragment>
            <Header />
            <Search />
            <Domains />
          </Fragment>
        </div>
    </DomainState>
  );
}

export default App;
