import React, {useState} from 'react'
import ArrowLeft from "../../assets/icon/arrow-left.svg";
import {formatAddress, formatAmount} from "../../utils/format";
import {CheckCircle} from "react-feather";
import {loadChainInfo} from "./Bridge";
import {getContract, useActiveWeb3React} from "../../web3";
import Circle from "../../assets/icon/circle.svg";
import {DEFAULT_TOKEN} from "../../const";
import {useClaimList} from "../Hooks";

export const ClaimList = ({token = DEFAULT_TOKEN, onWithdraw}) => {
  const {account, library} = useActiveWeb3React()

  const claimList = useClaimList(token)

  console.log('claimList', token.symbol, claimList.token?.symbol)

  return (
      <div className="claim_list">
        {(!claimList.list || claimList.token !== token) ? (
            <img className="investment__modal__loading" src={Circle} alt=""/>
        ) : (
            <>
              {claimList.list
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
                              {/*<img src={loadChainInfo(item.toChainId).icon}/>*/}
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
