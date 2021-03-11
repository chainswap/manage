import React, {useReducer} from 'react';
import {
    HANDLE_SHOW_CONNECT_MODAL,
    HANDLE_MY_NFTS_MODAL,
    HANDLE_WEB3_CONTEXT,
    HANDLE_SHOW_STAKE_MODAL,
    HANDLE_SHOW_UNSTAKE_MODAL,
    HANDLE_SHOW_REWARD_MODAL,
    HANDLE_SHOW_STAKED_TOKENS_MODAL,
    HANDLE_SHOW_UNSTAKED_TOKENS_MODAL,
    HANDLE_SHOW_FAILED_TRANSACTION_MODAL,
    HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL,
    HANDLE_SHOW_TRANSACTION_MODAL,
    HANDLE_WALLET_MODAL,
    HANDLE_TX_STATUS,
    HANDLE_SHOW_MENUMASK_MODAL, ANTIMATTER_TRANSACTION_LIST, HANDLE_POPUP_LIST, CLEAR_ANTIMATTER_TRANSACTION_LIST,
} from './const';

const mainContext = React.createContext();

const reducer = (state, action) => {
    console.log('action_type', action.type)
    switch (action.type) {
        case HANDLE_SHOW_CONNECT_MODAL:
            return {...state, showConnectModal: action.showConnectModal};
        case HANDLE_SHOW_STAKE_MODAL:
            return {...state, showStakeModal: action.showStakeModal};
        case HANDLE_SHOW_UNSTAKE_MODAL:
            return {...state, showUnstakeModal: action.showUnstakeModal};
        case HANDLE_SHOW_REWARD_MODAL:
            return {...state, showRewardModal: action.showRewardModal};
        case HANDLE_SHOW_STAKED_TOKENS_MODAL:
            return {
                ...state,
                showStakedTokensModal: action.showStakedTokensModal,
            };
        case HANDLE_SHOW_UNSTAKED_TOKENS_MODAL:
            return {
                ...state,
                showUnstakedTokensModal: action.showUnstakedTokensModal,
            };
        case HANDLE_SHOW_FAILED_TRANSACTION_MODAL:
            return {
                ...state,
                showFailedTransactionModal: action.showFailedTransactionModal,
            };
        case HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL:
            return {
                ...state,
                showWaitingWalletConfirmModal:
                action.showWaitingWalletConfirmModal,
            };
        case HANDLE_SHOW_TRANSACTION_MODAL:
            return {
                ...state,
                showTransactionModal: action.showTransactionModal,
            };
        case HANDLE_WALLET_MODAL:
            return {...state, walletModal: action.walletModal};
        case HANDLE_TX_STATUS:
            return {...state, txStatus: action.txStatus};
        case HANDLE_SHOW_MENUMASK_MODAL:
            return {...state, showMenuMaskModal: action.showMenuMaskModal};
        case ANTIMATTER_TRANSACTION_LIST:
            let lastTxs = state.transactions
            if (action.transaction.receipt) {
                const index = lastTxs.findIndex(item => {
                    return item.hash === action.transaction.hash
                })
                if (index !== -1) {
                    lastTxs[index] = action.transaction
                }
            } else {
                lastTxs = [action.transaction].concat(lastTxs)
            }
            window.localStorage.setItem(ANTIMATTER_TRANSACTION_LIST, JSON.stringify(lastTxs))
            return {...state, transactions: lastTxs}
        case CLEAR_ANTIMATTER_TRANSACTION_LIST:
            return {...state, transactions: []}
        case HANDLE_POPUP_LIST:
            let popups = state.popupList
            const popup = action.popup
            console.log('popup--->',action.auction, action.popup)
            if (action.auction === 'add') {
                popups = [popup].concat(popups)
            } else {
                popups = popups.filter(item => {return item.key !== popup.key})
            }
            return {...state, popupList: popups};
        default:
            return state;
    }
};

const ContextProvider = (props) => {
    const transactionsData = window.localStorage.getItem(ANTIMATTER_TRANSACTION_LIST)
    const [state, dispatch] = useReducer(reducer, {
        showConnectModal: false,
        showStakeModal: false,
        showUnstakeModal: false,
        showRewardModal: false,
        showStakedTokensModal: false,
        showUnstakedTokensModal: false,
        showFailedTransactionModal: false,
        showWaitingWalletConfirmModal: {show: false, title: '', content: ''},
        showTransactionModal: false,
        walletModal: null,
        txStatus: null,
        showMenuMaskModal: false,
        transactions: transactionsData ? JSON.parse(transactionsData) : [],
        popupList: []
    });
    return (
        <mainContext.Provider value={{state, dispatch}}>
            {props.children}
        </mainContext.Provider>
    );
};

export {reducer, mainContext, ContextProvider};
