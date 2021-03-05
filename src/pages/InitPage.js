import React, {useContext, useEffect} from 'react';
import {WalletConnect} from '../components/account/WalletConnect';
import {useWeb3React} from '@web3-react/core';
import {mainContext} from '../reducer';
import {
    StakeModal,
    UnstakeModal,
    ClaimRewardModal,
    StakedTokensModal,
    FailedTransactionModal,
    WaitingWalletConfirmModal,
    TransactionModal,
} from '../components/Modals';
import {MenuMask} from '../components/menumask/index';
import {
    GALLERY_SELECT_WEB3_CONTEXT,
    HANDLE_WALLET_MODAL,
    HANDLE_SHOW_MENUMASK_MODAL,
} from '../const';
import {InjectedConnector} from '@web3-react/injected-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import {LedgerConnector} from '@web3-react/ledger-connector';
import {WalletModal} from '../components/Modals/WalletModal';
import {WalletChange} from '../components/account/WalletChange';
import {LoginModal} from '../components/Modals/LoginModl';
import {TXStatusModal} from '../components/Modals/TXStatusModal';
import satellite from '../assets/image/satellite.png';
import {TransactionsUpdater} from "./Hooks";

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 56, 42, 128],
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/092b404ef4534f8e9f3acb4e047049c9',
    4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
};

const walletconnect = new WalletConnectConnector({
    rpc: {1: RPC_URLS[1]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

const ledger = new LedgerConnector({
    chainId: 1,
    url: RPC_URLS[1],
    pollingInterval: POLLING_INTERVAL,
});

const wallets = {
    MetaMask: injected,
    WalletConnect: walletconnect,
    Ledger: ledger,
    //TrustWallet: injected,
    //Squarelink: squarelink,
    //Torus: torus,
    //Aut
};

export const InitPage = () => {
    const context = useWeb3React();
    const {activate, active} = context;

    useEffect(() => {
        const localContent =
            window && window.localStorage.getItem(GALLERY_SELECT_WEB3_CONTEXT);
        console.log('wallet content', localContent);
        if (localContent) {
            console.log('activate', wallets[localContent]);
            !active && activate(wallets[localContent]);
        }
    }, [active]);

    return (
        <>
            <TransactionsUpdater/>

        </>
    );
};
