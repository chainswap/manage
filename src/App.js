import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './styles.css'
import './assets/css/style.scss';
import { Home } from './pages/Home';
import { Investment } from './pages/investment/Investment';
import { ContextProvider } from './reducer';
import { InitPage } from './pages/InitPage';
import {Bridge} from "./pages/bridge/Bridge";

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

function App() {
    useEffect(() => {
        const el = document.querySelector('.loader-container');
        if (el) {
            el.remove();
        }
    }, []);

    return (
        <ContextProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <Bridge />
                        </Route>
                        <Route exact path='/investment'>
                            <Investment />
                        </Route>
                        <Route path='/'>
                            <Home />
                        </Route>
                    </Switch>
                    <InitPage />
                </Router>
            </Web3ReactProvider>
        </ContextProvider>
    );
}

export default App;
