import React, {useEffect, useState} from 'react'
import LogoLineWhite from '../../assets/image/logo-line-white.png'
import Circle from '../../assets/icon/circle.svg'
import Success from '../../assets/icon/success.svg'
import Warning from '../../assets/icon/warning.svg'
import metamask from '../../assets/icon/metamask.png';
import walletConnect from '../../assets/icon/walletConnect.png';
import {useWeb3React} from "@web3-react/core";
import {GALLERY_SELECT_WEB3_CONTEXT, HANDLE_SHOW_WAITING_WALLET_CONFIRM_MODAL, waitingForApprove} from "../../const";
import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import {formatAddress, formatAmount} from "../../utils/format";
import BigNumber from "bignumber.js";
import {getContract} from "../../web3";
import ERC20 from "../../web3/abi/ERC20.json";
import {MATTER_ADDRESS, OFFERING_ADDRESS, USDT_ADDRESS} from "../../web3/address";
import {useQuota} from "./Hooks";


const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 128],
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: 'https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX',
    4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
};

const walletChange = new WalletConnectConnector({
    rpc: {1: RPC_URLS[1]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

const MODE_TYPE = {
    INIT: 'INIT',
    WALLETS: 'WALLETS',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    CONNECT_ERROR: "CONNECT_ERROR",
    CONTRIBUTION: "CONTRIBUTION",
    NOT_ELIGIBLE: "NOT_ELIGIBLE",
    CONTRIBUTE_SUCCESS: "CONTRIBUTE_SUCCESS",
    CONTRIBUTED: "CONTRIBUTED",
    WAITING: "WAITING",

}

export const Investment = () => {

    const context = useWeb3React();
    const {
        connector,
        library,
        account,
        activate,
        deactivate,
        active,
        chainId
    } = context;

    const [walletModal, setWalletModal] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [modalType, setModalType] = useState('INIT')

    const {quota} = useQuota()

    useEffect(() => {
        console.log('account', account, active)
        if (account) {
            setModalType(MODE_TYPE.CONTRIBUTION)
        } else {
            setModalType(MODE_TYPE.INIT)
        }
    }, [account])

    const OnContribute = async () => {
        const tokenContract = getContract(library, ERC20.abi, USDT_ADDRESS(chainId));
        const contract = getContract(library, ERC20.abi, OFFERING_ADDRESS(chainId));
        setModalType(MODE_TYPE.WAITING)
        try {
            const allowance = await tokenContract.methods.allowance(account, OFFERING_ADDRESS(chainId)).call()
            if (!new BigNumber(allowance).isGreaterThan('0')) {
                await tokenContract.methods
                    .approve(MATTER_ADDRESS(chainId), '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({from: account});
            }

        } catch (e) {

        }

    }


    return (
        <div className="investment">
            <header>
                <img src={LogoLineWhite} alt=""/>
                {active && account && (
                    <div className="wallet">
                        <p className="wallet__balance">1.24 MATTER</p>
                        <p className="wallet__address">{formatAddress(account)}</p>
                    </div>
                )}
            </header>

            <div className="investment__init">
                {modalType === MODE_TYPE.INIT && (
                    <div className="investment__init__frame">
                        <div>
                            <p className="investment__init__title">Investment Portal</p>
                            <p className="investment__init__sub_title">Welcome to Antimatter family! Please connect your
                                wallet to see if you are eligible for contribution</p>
                            <button className="button" onClick={() => {
                                setModalType(MODE_TYPE.WALLETS)
                            }}>Connect Wallet
                            </button>
                        </div>
                        <video
                            muted
                            controls={null}
                            src={require("../../assets/animation.mp4")}
                            autoPlay='autoPlay'
                            loop='loop'
                            style={{height: 680, marginTop: -180}}
                        />
                    </div>
                )}

                {modalType === MODE_TYPE.WALLETS && (
                    <>
                        <div style={{paddingBottom: 40}} className="investment__modal">
                            <p className="investment__modal__title">Connect to a wallet</p>
                            <button onClick={() => {
                                setModalType(MODE_TYPE.CONNECTING)
                                activate(injected)
                                    .then(() => {
                                        setModalType(MODE_TYPE.CONNECTED)
                                        window &&
                                        window.localStorage.setItem(
                                            GALLERY_SELECT_WEB3_CONTEXT,
                                            'MetaMask'
                                        );
                                    })
                                    .catch(() => {
                                    })
                            }}>
                                <img src={metamask}/>
                                MetaMask
                            </button>
                            <button style={{marginTop: 16}} onClick={() => {
                                setModalType(MODE_TYPE.CONNECTING)
                                activate(walletChange)
                                    .then(() => {
                                        setModalType(MODE_TYPE.CONNECTED)
                                        window &&
                                        window.localStorage.setItem(
                                            GALLERY_SELECT_WEB3_CONTEXT,
                                            'WalletConnect'
                                        );
                                    })
                                    .catch(() => {
                                    })
                            }}>
                                <img src={walletConnect}/>
                                WalletConnect
                            </button>
                        </div>
                    </>
                )}

                {modalType === MODE_TYPE.CONNECTING && (
                    <div className="investment__modal">
                        <p className="investment__modal__title">Please wait a little...</p>
                        <img className="investment__modal__loading" src={Circle} alt=""/>
                    </div>
                )}

                {modalType === MODE_TYPE.CONNECTED && (
                    <div className="investment__modal">
                        <img className="investment__modal__icon" src={Success} alt=""/>
                        <p>Your wallet was succesfully connected</p>
                        <button style={{marginTop: 50}} onClick={() => {
                            setModalType(MODE_TYPE.CONTRIBUTION)
                        }}>Continue
                        </button>
                    </div>
                )}

                {modalType === MODE_TYPE.NOT_ELIGIBLE && (
                    <div className="investment__modal">
                        <img src={Warning} alt=""/>
                        <p style={{marginTop: 19}}>Sorry! You are not eligible for contribution. Please switch your
                            wallet</p>
                    </div>
                )}

                {modalType === MODE_TYPE.CONTRIBUTE_SUCCESS && (
                    <div className="investment__modal">
                        <img src={Success}/>
                        <p style={{marginTop: 20}}>Congratulations!</p>
                        <p>You successfully join the Antimatter family</p>
                        <button style={{marginTop: 50}} onClick={() => {
                            setModalType(MODE_TYPE.CONTRIBUTED)
                        }}>Confirm
                        </button>
                    </div>
                )}

                {modalType === MODE_TYPE.CONTRIBUTION && (
                    <div className="investment__modal">
                        <p>Your Contribution Amount is: {quota? formatAmount(quota, 6): '--'} USDT</p>
                        <button style={{marginTop: 50}} onClick={() => {

                        }}>Contribute
                        </button>
                    </div>
                )}

                {modalType === MODE_TYPE.CONTRIBUTED && (
                    <div className="investment__contribution">
                        <div className="investment__contribution__balls">
                            <div className="investment__contribution__balls__ball">
                                <span>USDT Allocation</span>
                                <span>12,500 USDT</span>
                            </div>
                            <div className="investment__contribution__balls__ball">
                                <p>MATTER token allocation</p>
                                <p>1,200 MATTER</p>
                            </div>
                        </div>

                        <div className="investment__contribution__table">
                            <p className="investment__contribution__table__title">
                                Investor Information
                            </p>
                            <ul>
                                <li>
                                    <p>Address</p>
                                    <p>{account}</p>
                                </li>
                                <li>
                                    <p>Round</p>
                                    <p>{''}</p>
                                </li>
                                <li>
                                    <p>USDT invested</p>
                                    <p>{''}</p>
                                </li>
                                <li>
                                    <p>USDT in wallet</p>
                                    <p>{''}</p>
                                </li>
                                <li>
                                    <p>DWZ in wallet</p>
                                    <p>{''}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

            </div>
            }


        </div>
    )
}