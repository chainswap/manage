import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './styles.css'
import './assets/css/style.scss';
import { ContextProvider } from './reducer';
import { InitPage } from './pages/InitPage';
import {Manager} from "./pages/bridge/Manager";

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
                        <Route path='/'>
                            <Manager />
                        </Route>
                        <Route exact path='/manager'>
                            <Manager />
                        </Route>
                    </Switch>
                    <InitPage />
                </Router>
            </Web3ReactProvider>
        </ContextProvider>
    );
}

export default App;
