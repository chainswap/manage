import React, {useEffect, useState} from 'react'
import {CHAIN, DropDown} from "../../components/dropdown";
import Exchange from '../../assets/icon/exchange.svg'
import Matter from '../../assets/icon/matter.svg'
import {useBalance} from "../Hooks";
import {MAPPED_ADDRESS, MATTER_ADDRESS, OFFERING_ADDRESS, USDT_ADDRESS} from "../../web3/address";
import {useWeb3React} from "@web3-react/core";
import {formatAddress, formatAmount, numToWei} from "../../utils/format";
import LogoLineWhite from "../../assets/image/logo-line-white.svg";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ReactComponent as Copy} from "../../assets/icon/copy.svg";
import {GALLERY_SELECT_WEB3_CONTEXT} from "../../const";
import metamask from "../../assets/icon/metamask.png";
import walletConnect from "../../assets/icon/walletConnect.png";
import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import BigNumber from "bignumber.js";
import ETH from '../../assets/icon/eth.svg'
import Binance from '../../assets/icon/binance.svg'
import Huobi from '../../assets/icon/huobi.svg'

import ArrowLeft from '../../assets/icon/arrow-left.svg'
import {getContract} from "../../web3";
import ERC20 from "../../web3/abi/ERC20.json";
import Mapped from "../../web3/abi/Mapped.json";
import {splitSignature} from '@ethersproject/bytes'
import {isAddress} from "../../utils/address";
import {ReactComponent as Close} from '../../assets/icon/close.svg'
import Success from "../../assets/icon/success.svg";


const MODE_TYPE = {
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
}

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 128],
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/3f6f55ba1ee540328662f8496ddbc228',
    4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
};

const walletChange = new WalletConnectConnector({
    rpc: {1: RPC_URLS[1]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});


export const Bridge = () => {

    const {
        connector,
        library,
        account,
        activate,
        deactivate,
        active,
        chainId
    } = useWeb3React();

    const balance = useBalance(MATTER_ADDRESS(chainId))

    const [modalType, setModalType] = useState(MODE_TYPE.INIT)

    const [amount, setAmount] = useState()
    const [inputAccount, setInputAccount] = useState()

    const [stake, setStake] = useState(0)

    const [inputError, setInputError] = useState()

    const [fromChainId, setFromChainId] = useState(1)
    const [toChainId, setToChainId] = useState(2)
    const [fromChain, setFromChain] = useState(CHAIN[0])
    const [toChain, setToChain] = useState(CHAIN[1])


    useEffect(() => {
        if (account) {
            setInputAccount(account)
        }
    }, [account])


    const onStake = async () => {
        const contract = getContract(library, Mapped, MAPPED_ADDRESS(chainId));
        setStake(1)
        try {
            try {
                const tokenContract = getContract(library, ERC20.abi, MATTER_ADDRESS(chainId));
                //setApprove(1)
                const allowance = await tokenContract.methods.allowance(account, MAPPED_ADDRESS(chainId)).call()
                console.log('approving', allowance)

                if (!new BigNumber(allowance).isGreaterThan(numToWei('0.1'))) {
                    await tokenContract.methods
                        .approve(MAPPED_ADDRESS(chainId), '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                        .send({from: account})
                        .on('transactionHash', hash => {

                        })
                        .on('receipt', (_, receipt) => {
                            //window.location.reload()
                        })
                        .on('error', (err, receipt) => {
                            //setApprove(0)
                        });
                }
            } catch (e) {
                //setApprove(0)
                console.log('approve  error--->')
            }
            await contract.methods
                .stake(numToWei('0.1'), 4, inputAccount)
                .send({from: account})
                .on('transactionHash', hash => {

                })
                .on('receipt', (_, receipt) => {
                    window.location.reload()
                })
                .on('error', (err, receipt) => {
                    setStake(0)
                });

        } catch (e) {
            setStake(0)
            console.log('stake  error--->', e)
        }
    }


    const onSign = async () => {
        const adminAddress = '0x626cc92a30Fc915c8705B0fFB1289304d0e765FB'
        const EIP712Domain = [
            {name: 'name', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'}
        ];
        const domain = {
            name: 'Antimatter.Finance Mapping Token',
            chainId: 4,
            verifyingContract: MATTER_ADDRESS(chainId)
        };
        const Mint = [
            {name: 'authorizer', type: 'address'},
            {name: 'to', type: 'address'},
            {name: 'volume', type: 'uint256'},
            {name: 'nonce', type: 'uint256'},
            {name: 'chainId', type: 'uint256'},
            {name: 'txHash', type: 'uint256'}
        ]
        const message = {
            authorizer: adminAddress,
            to: adminAddress,
            volume: '10000000000000000',
            nonce: '0x0',
            chainId: 4,
            txHash: '0x32d08c21c388112f16193d3910e780a5c2d1698a91b730e56ee5aa11918e9cd2'
        };
        const data = JSON.stringify({
            types: {
                EIP712Domain,
                Mint,
            },
            domain,
            primaryType: "Mint",
            message: message
        });
        console.log('data', data)
        const data1 = JSON.stringify({
            "types": {
                "EIP712Domain": [{"name": "name", "type": "string"}, {
                    "name": "version",
                    "type": "string"
                }, {"name": "chainId", "type": "uint256"}, {"name": "verifyingContract", "type": "address"}],
                "Person": [{"name": "name", "type": "string"}, {"name": "wallet", "type": "address"}],
                "Mail": [{"name": "from", "type": "Person"}, {"name": "to", "type": "Person"}, {
                    "name": "contents",
                    "type": "string"
                }]
            },
            "primaryType": "Mail",
            "domain": {
                "name": "Ether Mail",
                "version": "1",
                "chainId": 1,
                "verifyingContract": "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
            },
            "message": {
                "from": {"name": "Cow", "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},
                "to": {"name": "Bob", "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},
                "contents": "Hello, Bob!"
            }
        })
        console.log('data1', data1)

        library.send('eth_signTypedData_v4', [account, data])
            .then(splitSignature)
            .then(signature => {
                console.log('signature', signature.v, signature.r, signature.s,)
            })
    }


    return (
        <div className="page">
            <header>
                <img src={LogoLineWhite} alt=""/>
                {active && account && (
                    <div className="chain_info">
                        <div className="connected_chain">
                            <img src={chainId === 56? Binance : chainId === 128 ? Huobi:  ETH}/>
                            <p>{chainId === 56? 'BSC' : chainId === 128 ? 'HEC0':  'ETH'}</p>
                        </div>
                        <div className="wallet">
                            <p className="wallet__balance">{balance ? formatAmount(balance, 18, 2) : '--'} MATTER</p>
                            <p className="wallet__address" onClick={() => setModalType(MODE_TYPE.PROFILE)}>
                                <div className="dot"/>
                                <p>{formatAddress(account)}</p>
                                <CopyToClipboard
                                    text={account}
                                    onCopy={() => {
                                        // alert('copy success!')
                                    }}>
                                    <Copy/>
                                </CopyToClipboard>
                            </p>
                        </div>
                    </div>
                )}
            </header>

            {modalType === MODE_TYPE.WALLETS && (
                <div style={{paddingBottom: 40}} className="default_modal modal-wallets">
                    <Close className="close-btn" onClick={() => {
                        setModalType(MODE_TYPE.INIT)
                    }}/>
                    <p className="default_modal__title">Connected with MetaMask</p>
                    <button onClick={() => {
                        setModalType(MODE_TYPE.CONNECTING)
                        activate(injected)
                            .then(() => {
                                setModalType(MODE_TYPE.INIT)
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
                                setModalType(MODE_TYPE.INIT)
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
            )}

            {modalType === MODE_TYPE.PROFILE && (
                <div className="default_modal modal_profile">

                    <p className="default_modal__title">Connected with MetaMask</p>
                    <div className="modal_profile__address">
                        <div className="dot"/>
                        <p>{account && formatAddress(account)}</p>
                    </div>

                    <div className="modal_profile__copy">
                        <Copy/>
                        <p>{'Copy Address'}</p>
                    </div>

                    <div className="btn_group">
                        <button onClick={() => {
                            setModalType(MODE_TYPE.WALLETS)
                        }}>Change
                        </button>
                        <button onClick={() => {
                            setModalType(MODE_TYPE.INIT)
                        }}>Close
                        </button>
                    </div>
                </div>
            )}

            {modalType === MODE_TYPE.INIT && (
                <div className="bridge">
                    <h5 className="bridge__title">Cross Chain Bridge</h5>
                    <div className="inputs">
                        <div className="bridge__dropdown_frame">
                            <div className="dropdown">
                                <span>From</span>
                                <div/>
                                <DropDown disabledId={toChainId} index={0} onSelect={(e) => {
                                    setFromChain(e)
                                    setFromChainId(e.id)
                                }}/>
                            </div>
                            <img src={Exchange}/>
                            <div className="dropdown">
                                <span>To</span>
                                <div/>
                                <DropDown disabledId={fromChainId} index={1} onSelect={(e) => {
                                    setToChain(e)
                                    setToChainId(e.id)
                                }}/>
                            </div>
                        </div>

                        {active && (
                            <div className="bridge__input_frame">
                                <p>Destination Chain Wallet Address</p>
                                <input value={inputAccount}
                                       onChange={(e) => {
                                           const value = e.target.value
                                           setInputAccount(value)
                                       }} placeholder='Enter address to swap'/>
                                <p className="error">{!isAddress(inputAccount) ? 'invalid address' : ''}</p>
                                {inputAccount && (
                                    <button onClick={() => {
                                        setInputError(null)
                                        setInputAccount('')
                                    }} className="max">Clear
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="bridge__input_frame">
                            <p>Asset</p>
                            <input disabled style={{paddingLeft: 56}} value={'MATTER'}/>
                            <img src={Matter}/>
                        </div>

                        <div className="bridge__input_frame">
                            <p>Amount <span>{`Your balance: ${formatAmount(balance, 18, 6)} MATTER`}</span></p>
                            <input value={amount}
                                   onChange={(e) => {
                                       const value = e.target.value
                                       setAmount(value)
                                       setInputError(null)
                                       if (!balance || new BigNumber(numToWei(value)).isGreaterThan(balance)) {
                                           console.log('balance---->', numToWei(value))
                                           setInputError('you do not have enough MATTER')
                                       }
                                   }} placeholder='Enter amount to swap'/>
                            <p className="error">{inputError}</p>
                            <button onClick={() => {
                                setInputError(null)
                                setAmount(formatAmount(balance, 18, 18))
                            }} className="max">Max
                            </button>
                        </div>
                    </div>

                    {!active ? (
                        <button style={{marginTop: 18}} onClick={() => {
                            setModalType(MODE_TYPE.WALLETS)
                        }}>Connect Wallet</button>
                    ) : (
                        <button  style={{marginTop: 18}} disabled={!amount || inputError || !inputAccount || !isAddress(inputAccount)}
                                onClick={() => {
                                    setModalType(MODE_TYPE.SWITCH_CHAIN)
                                }}>Stake tokens in ETH network</button>
                    )}
                </div>
            )}

            {modalType === MODE_TYPE.SWITCH_CHAIN && (
                <div className="default_modal modal-switch">
                    <p className="default_modal__title" style={{width: 332}}>Please switch your wallet network to BSC to complete token
                        swap</p>
                    <div className="extra">
                        <p>From:</p>
                        <img src={fromChain.icon}/>
                        <h5>{fromChain && fromChain.title}</h5>
                        <img className="arrow" src={ArrowLeft}/>
                        <p>From:</p>
                        <img src={toChain.icon}/>
                        <h5>{toChain && toChain.title}</h5>
                    </div>
                    <div className="chain_tip">
                        <p>Destination Chain Address:</p>
                        <p>{formatAddress(account)}</p>
                    </div>
                    <div className="line"/>
                    <p>To learn more about how to add network to wallet, <a>click here</a></p>
                    <button onClick={() => {
                        setModalType(MODE_TYPE.CLAIM)
                    }} className="switch_btn">{`Switch wallet network to ${toChain.title}`}</button>
                </div>
            )}

            {modalType === MODE_TYPE.CLAIM && (
                <div className="default_modal">
                    <p className="default_modal__title" style={{marginBottom: 20}}>Claim tokens</p>
                    <p className="claim__amount">500 MATTER</p>
                    <div className="extra">
                        <p>From:</p>
                        <img src={ETH}/>
                        <h5>ETH</h5>
                        <img className="arrow" src={ArrowLeft}/>
                        <p>From:</p>
                        <img src={ETH}/>
                        <h5>BSC</h5>
                    </div>
                    <div className="chain_tip">
                        <p>Destination Chain Address:</p>
                        <p>{formatAddress(account)}</p>
                    </div>
                    <button onClick={() => {
                        setModalType(MODE_TYPE.CLAIMED)
                    }} className="switch_btn">Claim Tokens on BSC
                    </button>
                </div>
            )}

            {modalType === MODE_TYPE.CLAIMED && (
                <div className="default_modal claimed_mode">
                    <img src={Success}/>
                    <p style={{marginTop: 19, fontSize: 18}}>You have successfully claimed tokens to BSC</p>
                    <a>View on Etherscan</a>
                    <div className="add_token">
                        <p>Add MATTER to Metamask</p>
                        <img src={metamask}/>
                    </div>
                    <button style={{marginTop: 32}} onClick={() => {

                    }}>Close
                    </button>
                </div>
            )}
        </div>
    )
}