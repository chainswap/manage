import React, {useEffect, useState} from 'react'
import LogoLineWhite from '../../assets/image/logo-line-white.png'
import Circle from '../../assets/icon/circle.svg'
import Success from '../../assets/icon/success.svg'
import Warning from '../../assets/icon/warning.svg'
import metamask from '../../assets/icon/metamask.png';
import {ReactComponent as Copy} from '../../assets/icon/copy.svg';

import walletConnect from '../../assets/icon/walletConnect.png';
import {useWeb3React} from "@web3-react/core";
import {
    GALLERY_SELECT_WEB3_CONTEXT
} from "../../const";
import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import {formatAddress, formatAmount, fromWei} from "../../utils/format";
import BigNumber from "bignumber.js";
import {getContract} from "../../web3";
import ERC20 from "../../web3/abi/ERC20.json";
import Offer from "../../web3/abi/Offer.json";

import {MATTER_ADDRESS, OFFERING_ADDRESS, USDT_ADDRESS} from "../../web3/address";
import {useAmount, useQuota} from "./Hooks";
import {useBalance} from "../Hooks";


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
    WAITING: "WAITING"
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

    const [modalType, setModalType] = useState()
    const [approve, setApprove] = useState(0)
    const [contribute, setContribute] = useState(0)
    const [claim, setClaim] = useState(0)


    const {quota, volume, unLocked} = useQuota()
    const {balance, allowance} = useAmount()
    const usdtBalance = useBalance(USDT_ADDRESS(chainId))

    console.log('usdtBalance', usdtBalance)

    useEffect(() => {
        console.log('account', volume)
        if (account) {
            if (volume && new BigNumber(volume).isGreaterThan('0')) {
                setModalType(MODE_TYPE.CONTRIBUTED)
            } else {
                if (quota && new BigNumber(quota).isEqualTo('0')) {
                    setModalType(MODE_TYPE.NOT_ELIGIBLE)
                } else {
                    setModalType(MODE_TYPE.CONTRIBUTION)
                }
            }

        } else {
            setModalType(MODE_TYPE.INIT)
        }
    }, [account, volume])

    useEffect(() => {
        if (quota && allowance && new BigNumber(allowance).isGreaterThan(quota)) {
            setApprove(2)
        }
    }, [allowance, quota])

    const onApprove = async () => {
        const tokenContract = getContract(library, ERC20.abi, USDT_ADDRESS(chainId));
        setApprove(1)
        try {
            const allowance = await tokenContract.methods.allowance(account, OFFERING_ADDRESS(chainId)).call()
            console.log('approving', allowance)

            if (!new BigNumber(allowance).isGreaterThan(quota)) {
                await tokenContract.methods
                    .approve(OFFERING_ADDRESS(chainId), '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({from: account})
                    .on('transactionHash', hash => {

                    })
                    .on('receipt', (_, receipt) => {
                        window.location.reload()
                    })
                    .on('error', (err, receipt) => {
                        setApprove(0)
                    });
            }
        } catch (e) {
            setApprove(0)
            console.log('approve  error--->')
        }
    }

    const OnContribute = async () => {
        const contract = getContract(library, Offer, OFFERING_ADDRESS(chainId));
        setContribute(1)
        try {
            contract.methods.offer().send({from: account})
                .on('transactionHash', hash => {

                })
                .on('receipt', (_, receipt) => {
                    setModalType(MODE_TYPE.CONTRIBUTE_SUCCESS)
                })
                .on('error', (err, receipt) => {
                    setContribute(0)
                })

        } catch (e) {
            setContribute(0)
            console.log('contribute error', e)
        }

    }

    const onClaim = async () => {
        const contract = getContract(library, Offer, OFFERING_ADDRESS(chainId));
        setClaim(1)
        try {
            contract.methods.unlock().send({from: account})
                .on('transactionHash', hash => {

                })
                .on('receipt', (_, receipt) => {
                    window.location.reload()
                })
                .on('error', (err, receipt) => {
                    setClaim(0)
                })

        } catch (e) {
            setClaim(0)
            console.log('contribute error', e)
        }
    }

    return (
        <div className="investment">
            <header>
                <img src={LogoLineWhite} alt=""/>
                {active && account && (
                    <div className="wallet">
                        <p className="wallet__balance">{balance ? formatAmount(balance) : '--'} MATTER</p>
                        <p className="wallet__address">
                            <div className="dot"/>
                            <p>{formatAddress(account)}</p>
                            <Copy/>
                        </p>
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
                        {/*<video*/}
                        {/*    muted*/}
                        {/*    controls={null}*/}
                        {/*    src={require("../../assets/animation.mp4")}*/}
                        {/*    autoPlay='autoPlay'*/}
                        {/*    loop='loop'*/}
                        {/*    style={{height: 680, marginTop: -180}}*/}
                        {/*/>*/}
                    </div>
                )}

                {modalType === MODE_TYPE.WALLETS && (
                    <>
                        <div style={{paddingBottom: 40}} className="investment__modal modal-wallets">
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
                    <div className="investment__modal connecting">
                        <p className="investment__modal__title">Please wait a little...</p>
                        <img className="investment__modal__loading" src={Circle} alt=""/>
                    </div>
                )}

                {modalType === MODE_TYPE.CONNECTED && (
                    <div className="investment__modal connected">
                        <img className="investment__modal__icon" src={Success} alt=""/>
                        <p>Your wallet was succesfully connected</p>
                        <div className="modal_bottom">
                            <button onClick={() => {
                                setModalType(MODE_TYPE.CONTRIBUTION)
                            }}>Continue
                            </button>
                        </div>
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
                        <p>Your Contribution Amount is: {quota ? formatAmount(quota, 6) : '--'} USDT</p>
                        <div className="btn_group modal_bottom">
                            <button disabled={approve !== 0 || new BigNumber(allowance).isGreaterThan(quota)}
                                     onClick={onApprove}>
                                {approve === 1 ? 'Approving...' : ' Approve USDT'}
                            </button>
                            <button
                                disabled={approve !== 2 || contribute === 1 || new BigNumber(quota).isGreaterThan(usdtBalance)}
                                 onClick={OnContribute}>
                                {contribute === 1 ? 'Contributing' : new BigNumber(quota).isGreaterThan(usdtBalance) ? 'insufficient balance' : 'Contribute'}
                            </button>
                        </div>

                    </div>
                )}

                {modalType === MODE_TYPE.CONTRIBUTED && (
                    <div className="investment__contribution">
                        <div className="investment__contribution__balls">
                            <div className="investment__contribution__balls__ball">
                                <span>USDT Allocation</span>
                                <span>{quota ? formatAmount(quota, 6) : '--'} USDT</span>
                            </div>
                            <div className="investment__contribution__balls__ball">
                                <p>MATTER token allocation</p>
                                <p>{volume ? formatAmount(volume) : '--'} MATTER</p>
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
                                    <p>{'PRIVATE'}</p>
                                </li>
                                <li>
                                    <p>MATTER in wallet</p>
                                    <p>{balance ? formatAmount(balance) : '--'}</p>
                                </li>
                                <li>
                                    <p>Claimable balance</p>
                                    <p>{unLocked ? formatAmount(unLocked) : '--'} MATTER
                                        <button disabled={!unLocked || claim === 1 || new BigNumber(unLocked).isEqualTo('0')}
                                                onClick={onClaim}>
                                            {claim === 1 ? 'Claiming' : 'claim'}
                                        </button></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

            </div>

        </div>
    )
}