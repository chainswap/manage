import React from 'react'
import {useReceivedList} from "../../hooks/multicall/hooks";
import ArrowLeft from "../../assets/icon/arrow-left.svg";
import {formatAddress, formatAmount} from "../../utils/format";
import {CheckCircle} from "react-feather";
import {loadChainInfo} from "./Bridge";
import {getContract, useActiveWeb3React, useSingleContractMultipleData} from "../../web3";
import Circle from "../../assets/icon/circle.svg";
import MainMatter from '../../web3/abi/MainMatter.json'
import {MATTER_ADDRESS} from "../../web3/address";
export const ClaimList = ({onWithdraw}) =>{

  const {account, library} = useActiveWeb3React()

  // const receivedList1 = useReceivedList(1, 56)
  // const receivedList2 = useReceivedList(56, 1)

  const receivedList1 = useReceivedList(1, 56)
  const receivedList2 = useReceivedList(56, 1)

  const receivedList3 = useReceivedList(1, 128)
  const receivedList4 = useReceivedList(128, 1)

  const receivedList5 = useReceivedList(56, 128)
  const receivedList6 = useReceivedList(128, 56)

  const matterContract = getContract(library, MainMatter, MATTER_ADDRESS)
  const countList = useSingleContractMultipleData(matterContract, 'sentCount', [[3, account], [4, account]])
  console.log('countList', countList)
  return (
      <div className="claim_list" style={{overflow: !receivedList1 || !receivedList2 || !receivedList3 || !receivedList4 || !receivedList5 || !receivedList6? 'unset': 'auto'}}>
        {( !receivedList1 || !receivedList2 || !receivedList3 || !receivedList4 || !receivedList5 || !receivedList6) ? (
            <img  className="investment__modal__loading" src={Circle} alt=""/>
        ):(
            <>
          {(receivedList1?receivedList1:[])
              .concat(receivedList2? receivedList2 : [])
                  .concat(receivedList3? receivedList3 : [])
                  .concat(receivedList4? receivedList4 : [])
                  .concat(receivedList5? receivedList5 : [])
                  .concat(receivedList6? receivedList6 : [])
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

                      {item.received ? <CheckCircle color={'#27AE60'}/> : <button onClick={()=>onWithdraw(item)}
                      >Claim</button>}

                    </div>
                )
              })}
            </>
          )}

      </div>
  )
}
