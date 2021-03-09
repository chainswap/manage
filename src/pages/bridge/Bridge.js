import React, {useContext, useEffect, useState} from 'react'
import {CHAIN, DropDown} from "../../components/dropdown";
import Exchange from '../../assets/icon/exchange.svg'
import Matter from '../../assets/icon/matter.svg'
import {useBalance, useTransactionAdder} from "../Hooks";
import {MATTER_ADDRESS} from "../../web3/address";
import {useWeb3React} from "@web3-react/core";
import {formatAddress, formatAmount, numToWei} from "../../utils/format";
// import LogoLineWhite from "../../assets/image/logo-line-white.svg";
import LogoLineWhite from "../../assets/image/chainswap-logo.svg";

import {CopyToClipboard} from "react-copy-to-clipboard";
import {ReactComponent as Copy} from "../../assets/icon/copy.svg";
import {ANTIMATTER_TRANSACTION_LIST, GALLERY_SELECT_WEB3_CONTEXT} from "../../const";
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
import MainMatter from "../../web3/abi/MainMatter.json";
import {isAddress} from "../../utils/address";
import {ReactComponent as Close} from '../../assets/icon/close.svg'
import Success from "../../assets/icon/success.svg";
import Circle from "../../assets/icon/circle.svg";
import Error from "../../assets/icon/error.svg";
import Binnace_logo from "../../assets/icon/binance.svg";
import Huobi_logo from "../../assets/icon/huobi.svg";
import ETH_logo from "../../assets/icon/eth.svg";
import {mainContext} from "../../reducer";
import {CheckCircle, Triangle, Check} from 'react-feather'
import {PopupItem} from "../../components/popup/Popup";
import {ClaimList} from "./ClaimList";
import {escapeRegExp, getEtherscanLink} from "../../utils";

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
  SUBMITTED: "SUBMITTED",
  CLAIM_LIST: "CLAIM_LIST",
  CONFIRMING: 'CONFIRMING',
  ERROR: 'ERROR'
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 128],
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

const ETH_OPTIONS = [
  {id: 0, title: 'BSC', chainId: 56, logo: <Binance className="icon"/>, icon: Binnace_logo},
  {id: 1, title: 'HECO', chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo},
  {id: 4, title: 'Rinkeby', chainId: 4, logo: <ETH className="icon"/>, icon: ETH_logo}
]
const BINANCE_OPTIONS = [
  {id: 0, title: 'ETH', chainId: 1, logo: <ETH className="icon"/>, icon: ETH_logo},
  {id: 1, title: 'HECO', chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo},
  {id: 4, title: 'Rinkeby', chainId: 4, logo: <ETH className="icon"/>, icon: ETH_logo}
]
const HECO_OPTIONS = [
  {id: 0, title: 'ETH', chainId: 1, logo: <ETH className="icon"/>, icon: ETH_logo},
  {id: 1, title: 'BSC', chainId: 56, logo: <Binance className="icon"/>, icon: Binnace_logo},
  {id: 4, title: 'Rinkeby', chainId: 4, logo: <ETH className="icon"/>, icon: ETH_logo}
]


const ROPSTEN_OPTIONS = [
  {id: 0, title: 'Rinkeby', chainId: 4, logo: <ETH className="icon"/>, icon: ETH_logo}
]

const RINKEBY_OPTIONS = [
  {id: 0, title: 'Ropsten', chainId: 3, logo: <ETH className="icon"/>, icon: ETH_logo},
]

export const loadChainInfo = (id) => {
  switch (id) {
    case 1:
      return CHAIN[0]
    case 3:
      return CHAIN[3]
    case 4:
      return CHAIN[4]
    case 56:
      return CHAIN[1]
    case 128:
      return CHAIN[2]
    default:
  }
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group


export const Bridge = () => {

  const {
    library,
    activate,
    account,
    active,
    chainId
  } = useWeb3React();

  const {transactions, popupList} = useContext(mainContext).state;
  const {dispatch} = useContext(mainContext)
  const balance = useBalance(MATTER_ADDRESS)
  const addTransaction = useTransactionAdder()
  const [modalType, setModalType] = useState(MODE_TYPE.INIT)
  const [claimData, setClaimData] = useState()
  console.log('transactions',transactions)
  const [hash, setHash] = useState()

  const [copied, setCopied] = useState(false)

  const [withdrawData, setWithdrawData] = useState({})

  const [amount, setAmount] = useState()
  const [inputAccount, setInputAccount] = useState()

  const [inputError, setInputError] = useState()

  const [toChain, setToChain] = useState(CHAIN[0])
  const [toChainList, setToChainList] = useState(CHAIN)

  const deposite = transactions.find(item => {
    return item.stake && account === item.stake.fromAddress && item.stake.status !== 2
  })

  const withdraw = transactions.find(item => {
    return item.claim && item.claim.status === 0
  })

  useEffect(() => {
    if (active) {
      let curChainList = CHAIN
      switch (chainId) {
        case 1:
          curChainList = ETH_OPTIONS
          break;
        case 3:
          curChainList = ROPSTEN_OPTIONS
          break
        case 4:
          curChainList = RINKEBY_OPTIONS
          break
        case 56:
          curChainList = BINANCE_OPTIONS
          break
        case 128:
          curChainList = HECO_OPTIONS
          break
        default:
          curChainList = CHAIN
      }
      setToChainList(curChainList)
      setToChain(curChainList[0])
    }
  }, [active, chainId])


  useEffect(() => {
    if (claimData) {
      if (claimData.chainId === chainId) {
        setModalType(MODE_TYPE.CLAIM)
      } else {
        setModalType(MODE_TYPE.SWITCH_CHAIN)
      }
    }
  }, [claimData, chainId])


  useEffect(() => {
    if (account) {
      setInputAccount(account)
    }
  }, [account])


  const onStake = async () => {
    const contract = getContract(library, MainMatter, MATTER_ADDRESS, account);
    setModalType(MODE_TYPE.CONFIRMING)
    try {
      await contract.send(toChain.chainId, inputAccount, numToWei(amount), {from: account})
          .then((response) => {
            console.log('hash', response)
            setHash(getEtherscanLink(chainId, response.hash, 'transaction'))
            setModalType(MODE_TYPE.SUBMITTED)
            addTransaction(response, {
              stake: {
                fromChainId: chainId,
                toChainId: toChain.chainId,
                fromAddress: account,
                toAddress: inputAccount,
                status: 0,
                amount: numToWei(amount)
              },
              summary: `Deposited ${amount} in ${loadChainInfo(chainId).title}`,
              hashLink: getEtherscanLink(chainId, response, 'transaction')
            })
          })
    } catch (e) {
      setModalType(MODE_TYPE.ERROR)
      console.log('stake  error--->', e)
    }
  }


  const onClaim = async () => {
    const contract = getContract(library, MainMatter, MATTER_ADDRESS, account);
    setModalType(MODE_TYPE.CONFIRMING)
    try {
      const res = await fetch(`https://test.chainswap.exchange/web/getSignDataSyn?contractAddress=0x1C9491865a1DE77C5b6e19d2E6a5F1D7a6F2b25F&fromChainId=${withdrawData.fromChainId}&nonce=${withdrawData.nonce}&to=${withdrawData.toAddress}&toChainId=${withdrawData.toChainId}`)
      console.log('res--->', res)
      const jsonData = await res.json()
      const data = jsonData.data
      console.log('claim data', data.fromChainId, data.to, data.nonce, data.volume.toString(), data.signatory, data.signV, data.signR, data.signS)

      await contract.receive(data.fromChainId, data.to, data.nonce, data.volume.toString(), [{
        signatory: data.signatory,
        v: data.signV,
        r: data.signR,
        s: data.signS
      }], {from: account})
          .then(response => {
            setModalType(MODE_TYPE.SUBMITTED)
            setHash(getEtherscanLink(chainId, response.hash, 'transaction'))
            addTransaction(response, {
              claim: {
                fromChainId: data.fromChainId,
                toChainId: data.toChainId,
                fromAddress: account,
                toAddress: data.to,
                status: 0,
                amount: data.volume.toString()
              },
              summary: `Withdraw ${formatAmount(data.volume.toString())} in ${loadChainInfo(chainId).title}`,
              hashLink: getEtherscanLink(chainId, response, 'transaction')
            })

            const pastDispatch = deposite
            pastDispatch.stake.status = 2
            dispatch({
              type: ANTIMATTER_TRANSACTION_LIST,
              transaction: pastDispatch
            })
          })
          .catch(error => {
            console.log('onClaim error', error)
            setModalType(MODE_TYPE.ERROR)
          })
    } catch (e) {
      setModalType(MODE_TYPE.ERROR)
      console.log('claim error---->', e)
    }
  }

  return (
      <>
        <div className="page">

          <div className="popup_column">
            {popupList.map(item => {
              return <PopupItem key={item.key} popKey={item.key} hash={item.hash} content={item.summary}
                                success={item.success} removeAfterMs={4000}/>
            })}
          </div>

          <header>
            <img src={LogoLineWhite} alt=""/>
            {(active && account) ? (
                <div className="chain_info">
                  <button className="small" onClick={() => {
                    setModalType(MODE_TYPE.CLAIM_LIST)
                  }}>Claim List
                  </button>
                  <div className="connected_chain">
                    <img src={chainId === 56 ? Binance : chainId === 128 ? Huobi : ETH}/>
                    <p>{chainId === 56 ? 'BSC' : chainId === 128 ? 'HEC0' : 'ETH'}</p>
                  </div>
                  <div className="wallet">
                    <p className="wallet__balance">{balance ? formatAmount(balance, 18, 2) : '--'} MATTER</p>
                    <p className="wallet__address">
                      <div className="dot"/>
                      <p onClick={() => setModalType(MODE_TYPE.PROFILE)}>{formatAddress(account)}</p>
                      <CopyToClipboard
                          text={account}
                          onCopy={() => {
                            setCopied(true)
                            setTimeout(() => {
                              setCopied(false)
                            }, 1000)
                          }}>

                        {copied ? <Check/> : <Copy/>}

                      </CopyToClipboard>
                    </p>
                  </div>
                </div>
            ) : (
                <div className="chain_info buttons">
                  <button onClick={() => {
                    window.location.href = ""
                  }}>Apply for bridge listing
                  </button>
                  <button onClick={() => {
                    setModalType(MODE_TYPE.WALLETS)
                  }}>Connect Wallet
                  </button>
                </div>
            )}
          </header>

          {modalType === MODE_TYPE.WAITING && (
              <div className="default_modal connecting">
                <p className="default_modal__title">It takes a few minutes to populate your staking transaction record
                  on the other chain. Please wait patiently.</p>
                <img className="investment__modal__loading" src={Circle} alt=""/>
              </div>
          )}

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
                  <CopyToClipboard
                      text={account}
                      onCopy={() => {
                        setCopied(true)
                        setTimeout(() => {
                          setCopied(false)
                        }, 1000)
                      }}>

                    {copied ? <Check size={12}/> : <Copy size={12}/>}
                  </CopyToClipboard>
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

                <div className="transactions">
                  <p>Recent Transactions</p>
                  <ul>
                    {transactions.map(item => {
                      return (
                          <li>
                            <a href={item.hashLink} target="_blank">{item.summary}</a>
                            {!item.receipt ?
                                <img className="confirm_modal__loading"
                                     style={{width: 14, height: 14}}
                                     src={Circle}/>
                                :
                                item.receipt.status === 1 ?
                                    <CheckCircle size={14} color={'#27AE60'}/>
                                    : <Triangle size={14}/>
                            }
                          </li>
                      )
                    })}
                  </ul>
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
                      <div className="default_drop">
                        <img src={chainId ? loadChainInfo(chainId).icon : loadChainInfo(1).icon}/>
                        <p>{chainId ? loadChainInfo(chainId).title : loadChainInfo(1).title}</p>
                      </div>
                    </div>
                    <img src={Exchange}/>
                    <div className="dropdown">
                      <span>To</span>
                      <div/>
                      <DropDown options={toChainList} index={toChain.id} onSelect={(e) => {
                        setToChain(e)
                      }}/>
                    </div>
                  </div>

                  {active && (
                      <div className={`bridge__input_frame`}>
                        <p>Destination Chain Wallet Address</p>
                        <div className="bridge__input_frame__extra">
                          <input
                              value={inputAccount}
                              onChange={(e) => {
                                const value = e.target.value
                                setInputAccount(value)
                              }} placeholder='Enter address to swap'/>
                        </div>
                        <p className="error">{!isAddress(inputAccount) ? 'Invalid address' : ''}</p>
                      </div>
                  )}

                  {/*<div className="bridge__input_frame">*/}
                  {/*    <p>Asset</p>*/}
                  {/*    <input disabled style={{paddingLeft: 56}} value={'MATTER'}/>*/}
                  {/*    <img src={Matter}/>*/}
                  {/*</div>*/}

                  <div className="bridge__input_frame">
                    {active && <p>Amount <span>{`Your balance: ${formatAmount(balance, 18, 2)} MATTER`}</span></p>}

                    <div className={`bridge__input_frame__extra ${inputError ? 'input_error' : ''}`}>
                      <input
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          value={amount}
                          onChange={(e) => {
                            let value = e.target.value.replace(/,/g, '.')
                            if (value === '' || inputRegex.test(escapeRegExp(value))) {
                              console.log('value---->', (value))

                              setAmount(value)
                              setInputError(null)
                              if (!balance || new BigNumber(numToWei(value)).isGreaterThan(balance)) {
                                setInputError('You do not have enough MATTER')
                              }
                            }
                          }} placeholder='Enter amount to swap'/>
                      {inputAccount && (
                          <button className="max" onClick={() => {
                            setInputError(null)
                            setAmount(formatAmount(balance))
                          }}>Max
                          </button>
                      )}

                      <img src={Matter}/>
                      <p>MATTER</p>
                    </div>

                    <p className="error">{inputError}</p>
                  </div>
                </div>

                {!active ? (
                    <button style={{marginTop: 18}} onClick={() => {
                      setModalType(MODE_TYPE.WALLETS)
                    }}>Connect Wallet</button>
                ) : (
                    <div className="btn_group">
                      <button style={{
                        marginTop: 18,
                        display: deposite && deposite.stake.status === 0 ? 'flex' : 'block'
                      }}
                              disabled={!amount || (account && !new BigNumber(amount).isGreaterThan(0)) || inputError || !inputAccount || !isAddress(inputAccount) || (deposite || (deposite && deposite.stake.status !== 2))}
                              onClick={onStake}>

                        {(!deposite || (deposite && deposite.stake.status === 2))
                            ? `Deposit in ${loadChainInfo(chainId).title} Chain1`
                            : deposite.stake.status === 0
                                ? <>
                                  <img src={Circle} className="confirm_modal__loading"/>
                                  <p>Depositing</p>
                                </>
                                : deposite.stake.status === 1
                                    ? 'Deposited'
                                    : `Deposit in ${loadChainInfo(chainId).title} Chain2`}
                      </button>

                      <button style={{marginTop: 18, display: withdraw ? 'flex' : 'block'}}
                              disabled={!deposite || (deposite.stake && deposite.stake.status !== 1) || withdraw}
                              onClick={() => {
                                console.log('on withdraw', deposite)
                                setWithdrawData({
                                  fromChainId: deposite.stake.fromChainId,
                                  toChainId: deposite.stake.toChainId,
                                  toAddress: deposite.stake.toAddress,
                                  volume: deposite.stake.amount,
                                  nonce: deposite.nonce
                                })
                                setModalType(MODE_TYPE.CLAIM)
                              }}>{withdraw
                          ? <><img src={Circle} className="confirm_modal__loading"/> <p>Withdraw</p></>
                          : `Withdraw from ${toChain ? toChain.title : ' '} Chain`}
                      </button>
                    </div>

                )}

                <div className="bridge__step_frame">
                  {deposite && deposite.stake && deposite.stake.status === 1 ? (
                      <div className="step_circle">
                        <Check size={18}/>
                      </div>
                  ) : (
                      <p>1</p>
                  )}
                  <div></div>
                  <p>2</p>
                </div>

                {/*<a className="bridge__claim_text" onClick={() => {*/}
                {/*    setModalType(MODE_TYPE.CLAIM_LIST)*/}
                {/*}}>Claim List</a>*/}
              </div>
          )}

          {modalType === MODE_TYPE.SWITCH_CHAIN && (
              <div className="default_modal modal-switch">
                <p className="default_modal__title" style={{width: 332}}>
                  1. Please switch your wallet network to {claimData && loadChainInfo(claimData.chainId).title} to
                  complete token swap. 2. Also please switch to your wallet with the destination address
                </p>
                <div className="chain_tip">
                  <p>Destination Chain Address:</p>
                  <p>{claimData && formatAddress(claimData.toAddress, 10, -5)}</p>
                </div>
                <div className="extra">
                  <p>From:</p>
                  <img src={claimData && loadChainInfo(claimData.fromChainId).icon}/>
                  <h5>{claimData && loadChainInfo(claimData.fromChainId).title}</h5>
                  <img className="arrow" src={ArrowLeft}/>
                  <p>To:</p>
                  <img src={claimData && loadChainInfo(claimData.chainId).icon}/>
                  <h5>{claimData && loadChainInfo(claimData.chainId).title}</h5>
                </div>

                <div className="line"/>
                <p>To learn more about how to add network to wallet,
                  <a target="_blank"
                     href="https://antimatterdefi.medium.com/announcing-antimatter-defi-cross-chain-bridge-innovation-7d23515d0844">click
                    here</a>
                </p>
                <button disabled onClick={() => {
                  //setModalType(MODE_TYPE.CLAIM)
                }}
                        className="switch_btn">{`Switch wallet network  ${toChain.title} and refresh your page`}</button>
              </div>
          )}

          {modalType === MODE_TYPE.CLAIM && (
              <div className="default_modal claim_modal">
                <Close className="close-btn" onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}/>
                <div style={{opacity: chainId !== withdrawData.toChainId ? 1 : 0.2}}>
                  <p className="default_modal__title" style={{marginBottom: 20}}>
                    1. Please switch your wallet network
                    to {deposite && loadChainInfo(withdrawData.toChainId).title}
                    to complete token swap. 2. Also please switch
                    to your wallet with the destination address</p>
                  {chainId !== withdrawData.toChainId && (
                      <div className="extra">
                        <p>From:</p>
                        <img src={withdrawData && loadChainInfo(withdrawData.fromChainId).icon}/>
                        <h5>{withdrawData && loadChainInfo(withdrawData.fromChainId).title}</h5>
                        <img className="arrow" src={ArrowLeft}/>
                        <p>To:</p>
                        <img src={withdrawData && loadChainInfo(withdrawData.toChainId).icon}/>
                        <h5>{withdrawData && loadChainInfo(withdrawData.toChainId).title}</h5>
                      </div>
                  )}

                  <div className="chain_tip">
                    <p>Destination Chain Address:</p>
                    <p>{deposite && formatAddress(withdrawData.toAddress, 10, -5)}</p>
                  </div>
                </div>

                <div className="divider"/>

                <div style={{opacity: chainId === withdrawData.toChainId ? 1 : 0.2}}>
                  <p className="default_modal__title" style={{marginBottom: 20}}>2. Confirm Withdraw</p>
                  <p className="claim__amount">{withdrawData && formatAmount(withdrawData.volume)} MATTER</p>
                  {chainId === withdrawData.toChainId && (
                      <div className="extra">
                        <p>From:</p>
                        <img src={withdrawData && loadChainInfo(withdrawData.fromChainId).icon}/>
                        <h5>{withdrawData && loadChainInfo(withdrawData.fromChainId).title}</h5>
                        <img className="arrow" src={ArrowLeft}/>
                        <p>To:</p>
                        <img src={withdrawData && loadChainInfo(withdrawData.toChainId).icon}/>
                        <h5>{withdrawData && loadChainInfo(withdrawData.toChainId).title}</h5>
                      </div>
                  )}

                </div>
                <button disabled={withdrawData && chainId !== withdrawData.toChainId} onClick={onClaim}
                        className="switch_btn">
                  {withdraw ? <><img src={Circle} className="confirm_modal__loading"/> <p>Withdraw</p></>
                      : `Withdraw from ${deposite && loadChainInfo(deposite.stake.toChainId).title} Chain`}
                </button>
              </div>
          )}

          {modalType === MODE_TYPE.CLAIM_LIST && (
              <div className="default_modal claim_modal" style={{width: 512}}>
                <Close className="close-btn" onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}/>
                <p className="default_modal__title" style={{marginBottom: 24}}>Claim List</p>
                <ClaimList onWithdraw={(item) => {
                  setWithdrawData({
                    fromChainId: item.fromChainId,
                    nonce: item.nonce,
                    toAddress: account,
                    toChainId: item.toChainId,
                    volume: item.volume
                  })
                  setModalType(MODE_TYPE.CLAIM)
                }}/>
              </div>
          )}

          {modalType === MODE_TYPE.CLAIMED && (
              <div className="default_modal claimed_mode">
                <img src={Success}/>
                <p style={{marginTop: 19, fontSize: 18}}>You have successfully claimed tokens
                  to {claimData && loadChainInfo(claimData.chainId).title}</p>
                <a href={hash} target="_blank">View on Etherscan</a>
                <div className="add_token">
                  <p>Add MATTER to Metamask</p>
                  <p>Add MATTER to Metamask</p>
                  <img src={metamask}/>
                </div>
                <button style={{marginTop: 32}} onClick={() => {
                  window.location.reload()
                }}>Close
                </button>
              </div>
          )}

          {modalType === MODE_TYPE.SUBMITTED && (
              <div className="default_modal claimed_mode">
                <img src={Success}/>
                <p style={{marginTop: 19, fontSize: 18}}>Transaction Submitted</p>
                <a href={hash} target="_blank">View on Etherscan</a>
                <button style={{marginTop: 32}} onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}>Close
                </button>
              </div>
          )}

          {modalType === MODE_TYPE.CONFIRMING && (
              <div className="default_modal confirm_modal">
                <Close className="close-btn" onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}/>
                <img className="confirm_modal__loading" src={Circle} alt=""/>
                <p style={{fontSize: 20}}>Wait For Confirmation...</p>
                <p>{`Stake in ${chainId && loadChainInfo(chainId).title} Chain`}</p>

                <p className="color-gray">{`Confirm this transaction in your wallet`}</p>
              </div>
          )}

          {modalType === MODE_TYPE.ERROR && (
              <div className="default_modal confirm_modal">
                <Close className="close-btn" onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}/>
                <img src={Error} alt=""/>
                <p style={{fontSize: 20}}>Oops! Something went wrong</p>

                <div className="btn_group">
                  <button onClick={() => {
                    setModalType(MODE_TYPE.INIT)
                  }}>Close
                  </button>
                  <button onClick={() => {
                    setModalType(MODE_TYPE.INIT)
                  }}>Try again
                  </button>
                </div>
              </div>
          )}
        </div>
        )}
        <footer>
          {active ?
              <a target="_blank" href="https://nib4dj7a8ly.typeform.com/to/v8VcmCsg">Apply for bridge listing</a> :
              <div/>}
          <ul>
            <li>
              <a
                  target="_blank"
                  href="https://antimatterdefi.medium.com/"
              >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M22.042 3.38473C22.042 1.92627 20.8579 0.742188 19.3994 0.742188H3.12204C1.66358 0.742188 0.479492 1.92627 0.479492 3.38473V19.6621C0.479492 21.1206 1.66358 22.3047 3.12204 22.3047H19.3994C20.8579 22.3047 22.042 21.1206 22.042 19.6621V3.38473ZM12.4208 11.5235C12.4208 14.3635 10.1341 16.6658 7.31358 16.6658C4.49302 16.6658 2.20618 14.3635 2.20618 11.5235C2.20618 8.68351 4.49281 6.38108 7.31358 6.38108C10.1343 6.38108 12.4208 8.68351 12.4208 11.5235ZM18.0236 11.5235C18.0236 14.1968 16.8803 16.3648 15.4699 16.3648C14.0595 16.3648 12.9162 14.1968 12.9162 11.5235C12.9162 8.85028 14.0594 6.68232 15.4697 6.68232C16.8801 6.68232 18.0234 8.84956 18.0234 11.5235H18.0236ZM20.3153 11.5235C20.3153 13.9181 19.9132 15.8605 19.4172 15.8605C18.9211 15.8605 18.5192 13.9186 18.5192 11.5235C18.5192 9.1284 18.9212 7.18655 19.4172 7.18655C19.9131 7.18655 20.3153 9.12823 20.3153 11.5235Z"/>
                </svg>
              </a>
            </li>
            <li>
              <a
                  target="_blank"
                  href="https://twitter.com/chain_swap?s=21"
              >
                <svg width="23" height="18" viewBox="0 0 23 18" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M19.9804 2.81652C20.8942 2.28793 21.5953 1.44976 21.9244 0.451303C21.0688 0.941967 20.1234 1.29681 19.1147 1.48892C18.3098 0.656868 17.1593 0.138062 15.8861 0.138062C13.4434 0.138062 11.464 2.053 11.464 4.41454C11.464 4.74981 11.5007 5.07651 11.5766 5.38853C7.90124 5.20988 4.64225 3.50908 2.45904 0.919942C2.07809 1.55377 1.8604 2.28793 1.8604 3.07103C1.8604 4.55403 2.64129 5.86329 3.82845 6.63171C3.10325 6.60968 2.42107 6.41513 1.8237 6.09699V6.14961C1.8237 8.22239 3.34751 9.95133 5.37378 10.3429C5.00169 10.4432 4.61188 10.4934 4.20687 10.4934C3.92211 10.4934 3.64367 10.4677 3.37536 10.4175C3.9373 12.1159 5.57122 13.3542 7.50763 13.3872C5.99268 14.5349 4.08537 15.2177 2.01354 15.2177C1.65663 15.2177 1.30352 15.1994 0.958008 15.159C2.91593 16.3716 5.24089 17.08 7.73924 17.08C15.8772 17.08 20.3246 10.5631 20.3246 4.91132C20.3246 4.72534 20.3221 4.54057 20.3133 4.35826C21.1777 3.75502 21.9295 3.00129 22.5205 2.14354C21.727 2.4837 20.8739 2.71374 19.9804 2.81652Z"/>
                </svg>
              </a>
            </li>
            <li>
              <a
                  target="_blank"
                  href="https://t.me/antimatterchat"
              >
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M16.9544 19.7557C17.2436 19.9726 17.6165 20.0268 17.9489 19.8937C18.2813 19.7595 18.5257 19.4589 18.5994 19.0946C19.3801 15.2095 21.2739 5.37606 21.9846 1.84203C22.0385 1.57566 21.9487 1.29884 21.751 1.12095C21.5534 0.943058 21.2793 0.891689 21.035 0.987769C17.2679 2.46417 5.66664 7.07316 0.924799 8.93102C0.62383 9.04898 0.427975 9.3553 0.437857 9.6911C0.448638 10.0279 0.662462 10.3199 0.970619 10.4179C3.09717 11.0914 5.88855 12.0284 5.88855 12.0284C5.88855 12.0284 7.19306 16.1998 7.87316 18.3212C7.95851 18.5875 8.15526 18.7968 8.4149 18.8691C8.67365 18.9405 8.95036 18.8653 9.14352 18.6722C10.236 17.5801 11.925 15.8916 11.925 15.8916C11.925 15.8916 15.1342 18.383 16.9544 19.7557ZM7.06278 11.5014L8.57123 16.7696L8.90634 13.4335C8.90634 13.4335 14.7344 7.86748 18.0567 4.69494C18.1537 4.60171 18.1672 4.4457 18.0864 4.3363C18.0064 4.2269 17.8591 4.20122 17.7486 4.27542C13.8979 6.87909 7.06278 11.5014 7.06278 11.5014Z"/>
                </svg>
              </a>
            </li>
          </ul>

        </footer>
      </>
  )
}
