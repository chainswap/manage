import React from 'react'
import {useReceivedList} from "../../hooks/multicall/hooks";
import ArrowLeft from "../../assets/icon/arrow-left.svg";
import {formatAddress, formatAmount} from "../../utils/format";
import {CheckCircle} from "react-feather";
import {loadChainInfo} from "./Bridge";
import {useActiveWeb3React} from "../../web3";
import Circle from "../../assets/icon/circle.svg";

export const ClaimList = ({onWithdraw}) =>{

  const {account} = useActiveWeb3React()

  const receivedList1 = useReceivedList(4, 3)
  const receivedList2 = useReceivedList(3, 4)

  console.log('list----->', receivedList1)
  console.log('list----->', receivedList2)

  return (
      <div className="claim_list">
        {(!receivedList1 && !receivedList2) ? (
            <img className="investment__modal__loading" src={Circle} alt=""/>
        ):(
            <>
          {(receivedList1?receivedList1:[]).concat((receivedList2? receivedList2 : []))
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
