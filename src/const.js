import React from 'react'
import Huobi from "./assets/icon/huobi.svg";
import Huobi_logo from "./assets/icon/huobi.svg";
import Binance from "./assets/icon/binance.svg";
import Binnace_logo from "./assets/icon/binance.svg";
import ETH from "./assets/icon/eth.svg";
import ETH_logo from "./assets/icon/eth.svg";
export const HANDLE_WEB3_CONTEXT = "HANDLE_WEB3_CONTEXT";

export const HANDLE_MY_NFTS_MODAL = "HANDLE_MY_NFTS_MODAL";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const HANDLE_SHOW_CONNECT_MODAL = "HANDLE_SHOW_CONNECT_MODAL";
export const HANDLE_SHOW_STAKE_MODAL = "HANDLE_SHOW_STAKE_MODAL";
export const HANDLE_SHOW_UNSTAKE_MODAL = "HANDLE_SHOW_UNSTAKE_MODAL";
export const HANDLE_SHOW_REWARD_MODAL = "HANDLE_SHOW_REWARD_MODAL";
export const HANDLE_SHOW_STAKED_TOKENS_MODAL = "HANDLE_SHOW_STAKED_TOKENS_MODAL";
export const HANDLE_SHOW_UNSTAKED_TOKENS_MODAL = "HANDLE_SHOW_UNSTAKED_TOKENS_MODAL";
export const HANDLE_SHOW_FAILED_TRANSACTION_MODAL = "HANDLE_SHOW_FAILED_TRANSACTION_MODAL";
export const HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL = "HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL";
export const HANDLE_SHOW_MENUMASK_MODAL="HANDLE_SHOW_MENUMASK_MODAL"

export const HANDLE_SHOW_TRANSACTION_MODAL = "HANDLE_SHOW_TRANSACTION_MODAL"

export const REQUESTING_DATA = "--"

export const GALLERY_SELECT_WEB3_CONTEXT = "ANTIMATTER_SELECT_WEB3_CONTEXT_RELEASE"

export const waitingForInit = {show: false, title: 'Waiting' ,content: '', link: null};


export const waitingForApprove = {show: true, title: 'Waiting for Approve' ,content: 'Approving spending limits on your wallet'}

export const waitingForConfirm = {show: true, title: 'Waiting For Confirmation' ,content: 'Confirm this transaction in your wallet'}

export const waitingPending = {show: true, title: 'Transaction submitted' ,content: 'View transaction'}

export const HANDLE_WALLET_MODAL = "HANDLE_WALLET_MODAL";
export const HANDLE_TX_STATUS = "HANDLE_TX_STATUS";

export const ANTIMATTER_TRANSACTION_LIST = 'ANTIMATTER_TRANSACTION_LIST'

export const CLEAR_ANTIMATTER_TRANSACTION_LIST = 'CLEAR_ANTIMATTER_TRANSACTION_LIST'

export const HANDLE_POPUP_LIST = 'HANDLE_POPUP_LIST'

export const HANDLE_TOKENS = 'HANDLE_TOKENS'

export const MODE_TYPE = {
  INIT: 'INIT',
  WALLETS: 'WALLETS',
  PROFILE: 'PROFILE',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CONNECT_ERROR: "CONNECT_ERROR",
  SWITCH_CHAIN: "SWITCH_CHAIN",
  NOT_ELIGIBLE: "NOT_ELIGIBLE",
  CONTRIBUTE_SUCCESS: "CONTRIBUTE_SUCCESS",
  CONTRIBUTED: "CONTRIBUTED",
  WAITING: "WAITING",
  CLAIM: "CLAIM",
  CLAIMED: "CLAIMED",
  SUBMITTED: "SUBMITTED",
  CLAIM_LIST: "CLAIM_LIST",
  CONFIRMING: 'CONFIRMING',
  ERROR: 'ERROR'
}

export const ALL_CHAINS = {
  1: {title: 'HECO', chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo},
  3: { title: 'Ropsten', chainId: 3, logo: <ETH className="icon"/>, icon: ETH_logo},
  4: {title: 'Rinkeby', chainId: 4, logo: <ETH className="icon"/>, icon: ETH_logo},
  56: {title: 'BSC', chainId: 56, logo: <Binance className="icon"/>, icon: Binnace_logo},
  128: {title: 'HECO', chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo},
}

