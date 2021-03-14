import React, {useEffect, useMemo, useState} from 'react'
import ArrowLeft from "../../assets/icon/arrow-left.svg";
import {formatAddress, formatAmount} from "../../utils/format";
import {CheckCircle} from "react-feather";
import {loadChainInfo} from "./Bridge";
import {getContract, getSingleCallResult, getSingleContractMultipleData, useActiveWeb3React} from "../../web3";
import Circle from "../../assets/icon/circle.svg";
import {DEFAULT_TOKEN} from "../../const";
import {getNetworkLibrary} from "../../hooks/multicall/hooks";
import MainMatter from "../../web3/abi/MainMatter.json";
import {useMulticallContract} from "../../web3/useContract";

export const ClaimList = ({token = DEFAULT_TOKEN, onWithdraw}) => {
  const {account} = useActiveWeb3React()

  //const claimList = useClaimList(token)

  const [claimList, setClaimList] = useState([])
  const [loading, setLoading] = useState(false)

  const queryPairs = useMemo(() => {
    if (!token.chains) return []
    const pairs = []
    for (let i = 0; i < token.chains.length; i++) {
      for (let k = token.chains.length - 1; k >= 0; k--) {
        pairs.push([token.chains[i], token.chains[k]])
      }
    }
    return pairs.filter(item => {
      return item[0] !== item[1]
    })
  }, [token])

  const multicallContract1 = useMulticallContract(1, getNetworkLibrary(1))
  const multicallContract3 = useMulticallContract(3, getNetworkLibrary(3))
  const multicallContract4 = useMulticallContract(4, getNetworkLibrary(4))
  const multicallContract56 = useMulticallContract(56, getNetworkLibrary(56))
  const multicallContract128 = useMulticallContract(128, getNetworkLibrary(128))

  const AllMulticallContract = {
    1: multicallContract1,
    3: multicallContract3,
    4: multicallContract4,
    56: multicallContract56,
    128: multicallContract128,
  }

  const fetchClaimList = async () => {
    console.log('token----->', token)
    setLoading(true)
    const results = await Promise.all(queryPairs.map(async item => {
      const fromChainId = item[0].chainId
      const toChainId = item[1].chainId
      const fromAddress = item[0].address
      const toAddress = item[1].address

      const fromMultcallContracct = AllMulticallContract[fromChainId]
      const toMultcallContracct = AllMulticallContract[toChainId]
      const fromContract = getContract(getNetworkLibrary(fromChainId), MainMatter, fromAddress)
      console.log('fromContract', fromContract)
      const count = await getSingleCallResult(fromMultcallContracct, fromContract, 'sentCount', [toChainId, account])
      const fromQueryData = []
      const toQueryData = []

      for (let i = 0; i < parseInt(count.toString()); i++) {
        fromQueryData[i] = [toChainId, account, parseInt(count.toString()) - (i + 1)]
        toQueryData[i] = [fromChainId, account, parseInt(count.toString()) - (i + 1)]
      }
      const sendResult = await getSingleContractMultipleData(fromMultcallContracct, getContract(getNetworkLibrary(fromChainId), MainMatter, fromAddress), 'sent', fromQueryData)
      const reResult = await getSingleContractMultipleData(toMultcallContracct, getContract(getNetworkLibrary(toChainId), MainMatter, toAddress), 'received', toQueryData)
      return sendResult.map((item, index) => {
        return {
          nonce: fromQueryData[index][2],
          fromChainId: fromChainId,
          toChainId: toChainId,
          mainAddress: token.address,
          fromTokenAddress: fromAddress,
          toTokenAddress: toAddress,
          volume: item.toString(),
          received: item.toString() === reResult[index]?.toString(),
          symbol: token.symbol
        }
      })
    }))


    const allData = results.reduce((a, b) => {
      return a.concat(b)
    })
    setClaimList(allData)
    setLoading(false)
  }

  useEffect(() => {
    fetchClaimList()
  }, [token])

  return (
      <div className="claim_list">
        {loading ? (
            <div className="loading_frame">
            <img className="investment__modal__loading" src={Circle} alt=""/>
            </div>
        ) : (
            <>
              {claimList.length === 0 &&  <p className="empty_list">
                 You currently don’t have transactions in the Claim List
              </p>}

              {claimList.length !== 0 && claimList
                  .map(item => {
                    return (
                        <div className="claim_item"
                             onClick={() => {

                             }}>
                          <div className="claim_item__item" style={{marginRight: 0}}>
                            <p>From:</p>
                            <div>
                              <img src={loadChainInfo(item.fromChainId).icon}/>
                              <p>{loadChainInfo(item.fromChainId).title}</p>
                              <img className="arrow" src={ArrowLeft}/>
                            </div>
                          </div>

                          <div className="claim_item__item">
                            <p>To:</p>
                            <div>
                              <img src={loadChainInfo(item.toChainId).icon}/>
                              <p>{loadChainInfo(item.toChainId).title}</p>
                            </div>
                          </div>

                          <div className="claim_item__item" style={{width: 100}}>
                            <p>Token:</p>
                            <div>
                              <img src={`https://raw.githubusercontent.com/williamzng/chainswap-assets/main/blockchains/ethereum/${token.address.toLowerCase()}.png`}/>
                              <p>{token.symbol}</p>
                            </div>
                          </div>

                          <div className="claim_item__item">
                            <p>Destination:</p>
                            <div>
                              <p>{account && formatAddress(account)}</p>
                            </div>
                          </div>

                          <div className="claim_item__item">
                            <p>Amount:</p>
                            <div>
                              <p>{formatAmount(item.volume)}</p>
                            </div>
                          </div>

                          {item.received ?
                              <CheckCircle style={{marginRight: 0, marginLeft: 'auto'}} color={'#27AE60'}/> :
                              <button style={{marginRight: 0}} onClick={() => onWithdraw(item)}
                              >Claim</button>}

                        </div>
                    )
                  })}
            </>
        )}

      </div>
  )
}
