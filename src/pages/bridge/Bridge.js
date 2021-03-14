import React, {useContext, useEffect, useMemo, useState} from 'react'
import {CHAIN, DropDown} from "../../components/dropdown";
import Exchange from '../../assets/icon/exchange.svg'
import Matter from '../../assets/icon/matter.svg'
import {useAllowance, useBalance, useTokenList, useTransactionAdder} from "../Hooks";
import {MATTER_ADDRESS, OFFERING_ADDRESS} from "../../web3/address";
import {useWeb3React} from "@web3-react/core";
import {formatAddress, formatAmount, numToWei} from "../../utils/format";
// import LogoLineWhite from "../../assets/image/logo-line-white.svg";
import LogoLineWhite from "../../assets/image/chainswap-logo.svg";
import Down from "../../assets/icon/down.svg";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ReactComponent as Copy} from "../../assets/icon/copy.svg";
import {
  ALL_CHAINS,
  ANTIMATTER_TRANSACTION_LIST,
  CLEAR_ANTIMATTER_TRANSACTION_LIST,
  GALLERY_SELECT_WEB3_CONTEXT,
  MODE_TYPE
} from "../../const";
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
import {AssetModal} from "../../components/modal/AssetModal";
import {SmallDropDown} from "../../components/dropdown/SmallDropdown";

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


  const [selectedToken, setSelectedToken] = useState()

  const [curAddress, setCurAddress] = useState()
  const [curChainId, setCurChainId] = useState()

  const tokenBalance = useBalance(curAddress, {curChainId})

  useEffect(() => {
    if (selectedToken) {
      const chain = selectedToken.chains.find(item => {
        return item.chainId === chainId
      })
      setCurChainId(chain.chainId)
      if (chain.address !== selectedToken.address) {
        if (chain.chainId === selectedToken.chainId) {
          setCurAddress(selectedToken.address)
        } else {
          setCurAddress(chain.address)
        }
      } else {
        setCurAddress(selectedToken.address)
      }
    }
  }, [selectedToken, chainId])

  const addTransaction = useTransactionAdder()

  const tokenList = useTokenList()

  const [modalType, setModalType] = useState(MODE_TYPE.INIT)
  const [hash, setHash] = useState()
  const [copied, setCopied] = useState(false)
  const [withdrawData, setWithdrawData] = useState()
  const [amount, setAmount] = useState()
  const [inputAccount, setInputAccount] = useState()
  const [inputError, setInputError] = useState()
  const [toChain, setToChain] = useState(CHAIN[0])
  const [toChainList, setToChainList] = useState(CHAIN)
  const [auction, setAuction] = useState('DEPOSIT')
  const [selectingToken, setSelectingToken] = useState(false)

  const [selectedReceivedToken, setSelectedReceivedToken] = useState()


  const deposite = transactions.find(item => {
    return item.stake && account === item.stake.fromAddress && item.stake.status !== 2
  })

  const withdraw = transactions.find(item => {
    return item.claim && item.claim.status === 0
  })

  const approve = transactions.find(item => {
    return item.approve && item.approve.status === 0 && item.approve.account === account
  })

  const approveStatus = useMemo(() => {
    if (!selectedToken) return false
    if (selectedToken.chainId.toString() !== chainId.toString()) return false
    const curToken = selectedToken.chains.find(item => {
      return item.chainId.toString() === chainId.toString()
    })
    return curToken.address !== selectedToken.address;
  }, [selectedToken, chainId])

  const curAllowance = useAllowance(selectedToken && approveStatus && selectedToken.address, selectedToken && selectedToken.chains.find(item => {
    return item.chainId === chainId
  }).address, {curChainId, approveStatus})

  const sendButton = useMemo(() => {
    if (approveStatus && approve) return (<><img src={Circle} className="confirm_modal__loading"/>
      <p>Approving</p></>)

    if (approveStatus && new BigNumber(curAllowance).isEqualTo('0')) return 'Approve'

    if ((!deposite || (deposite && deposite.stake.status === 2))) return `Deposit in ${loadChainInfo(chainId)?.title} Chain`

    if (deposite.stake.status === 0) return (<><img src={Circle} className="confirm_modal__loading"/>
      <p>Depositing</p></>)

    if (deposite.stake.status === 1) return 'Deposited'

    return `Deposit in ${loadChainInfo(chainId)?.title} Chain`

  }, [curAllowance, deposite, chainId, approve, approveStatus])


  const getSigns = (async () => {
    if (!withdrawData) return
    return await new Promise((resolve, reject) => {
      let signList = []
      let count = 0
      for (let i = 1; i < 6; i++) {
        try {
          fetch(`https://node${i}.chainswap.exchange/web/getSignDataSyn?contractAddress=${withdrawData.toTokenAddress}&fromChainId=${withdrawData.fromChainId}&nonce=${withdrawData.nonce}&to=${withdrawData.toAddress}&toChainId=${withdrawData.toChainId}&fromContract=${withdrawData.fromTokenAddress}&toContract=${withdrawData.toTokenAddress}&mainContract=${withdrawData.mainAddress}`)
              .then((response) => {
                return response.json()
              })
              .then((data) => {
                count++;
                if (data.data) {
                  signList.push({
                    signatory: data.data.signatory,
                    v: data.data.signV,
                    r: data.data.signR,
                    s: data.data.signS,
                    fromChainId: data.data.fromChainId,
                    to: data.data.to,
                    nonce: data.data.nonce,
                    volume: data.data.volume.toString()
                  })
                }
                if (signList.length === 3) {
                  console.log('resolve', signList)
                  resolve(signList)
                } else if (count === 5 && signList.length < 3) {
                  reject('query error')
                }

              })
        } catch (e) {
          throw e
        }

      }

    })
  })


  useEffect(() => {
    if (account) {
      setInputAccount(account)
    }
  }, [account])

  useEffect(() => {
    if (selectedToken) {
      const chains = selectedToken.chains
      const chainList = chains
          .filter(item => {
            return item.chainId !== chainId
          }).map((item, index) => {
            return {...ALL_CHAINS[item.chainId], id: index}
          })
      console.log('selectedToken', chains)

      setToChainList(chainList)
      setToChain(chainList[0])
    }

  }, [selectedToken, chainId])


  const onStake = async () => {
    setModalType(MODE_TYPE.CONFIRMING)

    try {
      setAuction('DEPOSIT')
      const fromToken = selectedToken.chains.find(item => {
        return item.chainId === chainId
      })
      const toToken = selectedToken.chains.find(item => {
        return item.chainId === toChain.chainId
      })

      const sendToken = selectedToken.chains.find(item => {
        return item.chainId === chainId
      })

      const contract = getContract(library, MainMatter, sendToken.address, account);

      if (approveStatus && new BigNumber(curAllowance).isEqualTo('0')) {
        const approveContract = getContract(library, MainMatter, selectedToken.address, account);
        await approveContract.approve(sendToken.address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            .then(response => {
              console.log('approve response', response)
              setHash(getEtherscanLink(chainId, response.hash, 'transaction'))
              setModalType(MODE_TYPE.SUBMITTED)
              addTransaction(response, {
                approve: {
                  account,
                  address: selectedToken.address,
                  chainId,
                  status: 0
                },
                summary: `Approved ${selectedToken.symbol} in ${loadChainInfo(chainId).title}`,
                hashLink: getEtherscanLink(chainId, response.hash, 'transaction')
              })

            })
        return
      }
      console.log('sendToken', sendToken.address, account, toChain.chainId, inputAccount, numToWei(amount, selectedToken.decimals))
      await contract.send(toChain.chainId, inputAccount, numToWei(amount, selectedToken.decimals), {
        from: account,
        value: numToWei('0.005')
      })
          .then((response) => {
            setHash(getEtherscanLink(chainId, response.hash, 'transaction'))
            setModalType(MODE_TYPE.SUBMITTED)
            addTransaction(response, {
              stake: {
                fromChainId: chainId,
                toChainId: toChain.chainId,
                fromAddress: account,
                toAddress: inputAccount,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
                status: 0,
                amount: numToWei(amount, selectedToken.decimals),
                symbol: selectedToken.symbol,
                mainAddress: selectedToken.address
              },
              summary: `Deposited ${amount} ${selectedToken.symbol} in ${loadChainInfo(chainId).title}`,
              hashLink: getEtherscanLink(chainId, response.hash, 'transaction')
            })
          })
    } catch (e) {
      setModalType(MODE_TYPE.ERROR)
      console.log('stake  error--->', e)
    }
  }

  const onClaim = async () => {
    console.log('toTokenAddress', withdrawData.toTokenAddress)

    setModalType(MODE_TYPE.CONFIRMING)
    const signs = await getSigns()
    setAuction('WITHDRAW')

    const contract = getContract(library, MainMatter, withdrawData.toTokenAddress, account);
    try {
      const defaultSign = signs[0]
      console.log('defaultSign', defaultSign.fromChainId, defaultSign.to, defaultSign.nonce, defaultSign.volume, signs.map(item => {
        return {
          signatory: item.signatory,
          v: item.v,
          r: item.r,
          s: item.s,
        }
      }))

      await contract.receive(defaultSign.fromChainId, defaultSign.to, defaultSign.nonce, defaultSign.volume, signs.map(item => {
        return {
          signatory: item.signatory,
          v: item.v,
          r: item.r,
          s: item.s,
        }
      }), {from: account, value: numToWei('0.005')})
          .then(response => {
            setModalType(MODE_TYPE.SUBMITTED)
            setHash(getEtherscanLink(chainId, response.hash, 'transaction'))
            addTransaction(response, {
              claim: {
                fromChainId: defaultSign.fromChainId,
                toChainId: defaultSign.toChainId,
                fromAddress: account,
                toAddress: defaultSign.to,
                status: 0,
                amount: defaultSign.volume
              },
              summary: `Withdraw ${formatAmount(defaultSign.volume)} ${withdrawData.symbol} in ${loadChainInfo(chainId).title}`,
              hashLink: getEtherscanLink(chainId, response.hash, 'transaction')
            })

            const pastDispatch = deposite
            pastDispatch.stake.status = 2
            dispatch({
              type: ANTIMATTER_TRANSACTION_LIST,
              transaction: pastDispatch
            })
          })
    } catch (e) {
      setModalType(MODE_TYPE.ERROR)
      throw "claim error" + e
    }
  }

  return (
      <>
        <div className="mobile">Phone version coming soon! Please use desktop version for now.</div>
        <div className="page">

          <div className="popup_column">
            {popupList.map(item => {
              return <PopupItem key={item.key} popKey={item.key} hash={item.hashLink} content={item.summary}
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
                      <div className="dot" onClick={() => setModalType(MODE_TYPE.PROFILE)}/>
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
                    window.location.href = "https://nib4dj7a8ly.typeform.com/to/v8VcmCsg"
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

          {modalType === MODE_TYPE.CONNECTING && (
              <div className="investment__modal connecting">
                <p className="investment__modal__title">Please wait a little...</p>
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

                  <Close className="close-btn" onClick={() => {
                    setModalType(MODE_TYPE.INIT)
                  }}/>

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
                  <a onClick={() => {
                    window.localStorage.setItem(ANTIMATTER_TRANSACTION_LIST, JSON.stringify([]))
                    dispatch({type: CLEAR_ANTIMATTER_TRANSACTION_LIST})
                  }} className="clear">(clear all)</a>
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
                    {active && selectedToken &&
                    <p>Amount <span>{`Your balance : ${tokenBalance ? formatAmount(tokenBalance, selectedToken.decimals, 2) : '--'} ${selectedToken ? selectedToken.symbol : ''}`}</span>
                    </p>}

                    <div className={`bridge__input_frame__extra ${inputError ? 'input_error' : ''}`}>
                      <input
                          disabled={!selectedToken || !tokenBalance}
                          pattern="^[0-9]*[.,]?[0-9]*$"
                          value={amount}
                          onChange={(e) => {
                            let value = e.target.value.replace(/,/g, '.')
                            if (value === '' || inputRegex.test(escapeRegExp(value))) {
                              setAmount(value)
                              setInputError(null)
                              if (!selectedToken || new BigNumber(numToWei(value, selectedToken.decimals)).isGreaterThan(tokenBalance)) {
                                setInputError(`You do not have enough ${selectedToken.symbol}`)
                              }
                            }
                          }} placeholder='Enter amount to swap'/>
                      {/*{inputAccount && (*/}
                      {/*    <button className="max" onClick={() => {*/}
                      {/*      setInputError(null)*/}
                      {/*      setAmount(formatAmount(balance, 18, 18))*/}
                      {/*    }}>Max*/}
                      {/*    </button>*/}
                      {/*)}*/}

                      <div className="asset" onClick={() => {
                        if(!active){
                          setModalType(MODE_TYPE.WALLETS)
                        }else {
                          setSelectingToken(true)
                        }
                      }}>
                        {selectedToken ? (
                            <>
                              <img src={Matter}/>
                              <p>{selectedToken.symbol}</p></>
                        ) : (
                            <>
                              <p>Select Token</p></>
                        )}

                        <img style={{width: 12, marginLeft: 0, marginRight: 12}} src={Down}/>
                      </div>
                    </div>

                    <p className="error">{inputError}</p>
                  </div>
                </div>

                {!active ? (
                    <button
                        style={{marginTop: 18}}
                        onClick={() => {
                          setModalType(MODE_TYPE.WALLETS)
                        }}>Connect Wallet</button>
                ) : (
                    <div className="btn_group">
                      <button
                          style={{
                            marginTop: 18,
                            display: ((deposite && deposite.stake.status === 0) || approve) ? 'flex' : 'block'
                          }}
                          disabled={approve || !new BigNumber(curAllowance).isEqualTo('0') && ((!amount) || (account && !new BigNumber(amount).isGreaterThan(0)) || inputError || !inputAccount || !isAddress(inputAccount) || (deposite || (deposite && deposite.stake.status !== 2)))}
                          onClick={onStake}>

                        {sendButton}
                      </button>

                      <button style={{marginTop: 18, display: withdraw ? 'flex' : 'block'}}
                              disabled={!deposite || (deposite.stake && deposite.stake.status !== 1) || withdraw}
                              onClick={() => {
                                setWithdrawData({
                                  fromChainId: deposite.stake.fromChainId,
                                  toChainId: deposite.stake.toChainId,
                                  toAddress: deposite.stake.toAddress,
                                  volume: deposite.stake.amount,
                                  nonce: deposite.nonce,
                                  toTokenAddress: deposite.stake.toTokenAddress,
                                  fromTokenAddress: deposite.stake.fromTokenAddress,
                                  symbol: deposite.stake.symbol,
                                  mainAddress: deposite.stake.mainAddress
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

          {modalType === MODE_TYPE.CLAIM && (
              <div className="default_modal claim_modal">
                <Close className="close-btn" onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}/>
                <div style={{opacity: chainId !== withdrawData.toChainId ? 1 : 0.2}}>
                  <p className="default_modal__title" style={{marginBottom: 20}}>
                    Please switch your wallet network to {deposite && loadChainInfo(withdrawData.toChainId).title} and
                    switch to your wallet with destination address.
                  </p>
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
                  <p className="claim__amount">{withdrawData && formatAmount(withdrawData.volume)} {withdrawData.symbol}</p>
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
                      : `Withdraw from ${withdrawData && loadChainInfo(withdrawData.toChainId).title} Chain`}
                </button>
              </div>
          )}

          {modalType === MODE_TYPE.CLAIM_LIST && (
              <div className="default_modal claim_modal" style={{width: 620}}>
                <Close className="close-btn" onClick={() => {
                  setModalType(MODE_TYPE.INIT)
                }}/>
                <div className="default_modal__header">
                  <p className="default_modal__title" style={{marginBottom: 'auto'}}>Claim List</p>
                  <div className="default_modal__header__dropdown">
                    <SmallDropDown onSelect={(token) => {
                      setSelectedReceivedToken(token)
                    }} options={tokenList.map(item => {
                      return {...item, title: item.symbol}
                    })}/>
                  </div>
                </div>
                <ClaimList token={selectedReceivedToken} onWithdraw={(item) => {
                  setWithdrawData({
                    fromChainId: item.fromChainId,
                    nonce: item.nonce,
                    toAddress: account,
                    toChainId: item.toChainId,
                    volume: item.volume,
                    toTokenAddress: item.toTokenAddress,
                    fromTokenAddress: item.fromTokenAddress,
                    symbol: item.symbol,
                    mainAddress: item.mainAddress
                  })
                  setModalType(MODE_TYPE.CLAIM)
                }}/>
              </div>
          )}

          {modalType === MODE_TYPE.SUBMITTED && (
              <div className="default_modal claimed_mode">
                <img src={Success}/>
                <p style={{marginTop: 19, fontSize: 18}}>Transaction Submitted</p>
                <a href={hash} target="_blank">View on {hash ? hash.indexOf('https://bscscan.com') !== -1 ? 'Bscscan' :
                    hash.indexOf('https://hecoinfo.com') !== -1 ? 'Hecoinfo' : 'Etherscan' : ''}</a>
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
                <p>{`${auction === 'DEPOSIT' ? 'deposit in' : 'withdraw from'} ${chainId && loadChainInfo(chainId).title} Chain`}</p>

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

        {selectingToken && <div className="modal-show">
          <div className="wrapper">
            <AssetModal tokenList={tokenList}
                        onSelect={(token) => {
                          console.log('onselect---->1', token)
                          setSelectedToken(token)
                        }}
                        onClose={() => {
                          setSelectingToken(false)
                        }}/>
          </div>
        </div>
        }


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
