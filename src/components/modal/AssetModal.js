import React, {useEffect, useState} from 'react'
import Circle from "../../assets/icon/circle.svg";
import {ReactComponent as Close} from "../../assets/icon/close.svg";
import Matter from '../../assets/icon/matter.svg'
import {formatAmount} from "../../utils/format";

export const AssetModal = ({tokenList, onSelect, onClose}) => {

  const [searchText, setSearchText] = useState()

  return (
      <div className='modal'>
        <div className='modal__box'>
          <div className='form-app'>
            <div className='form-app__inner'>

              <Close className="close-btn" onClick={onClose}/>

              <p className="form-app__title">Select a token</p>
              <input onChange={(e) => {
                setSearchText(e.target.value)
              }} placeholder='Search by name or paste address'/>
              <div className="form-app__inner__divider"/>

              {tokenList && tokenList.length !== 0 && tokenList[0].chains ? (
                  tokenList
                      .filter(item => {
                        console.log('searchText', searchText, item.symbol)
                        return !searchText || item.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                      }).map(item => {
                    return (
                        <div className="token__frame" onClick={() => {
                          console.log('selected--->', item)
                          onSelect(item)
                          onClose()
                        }}>
                          <img src={Matter}/>
                          <div className="token__frame__extra">
                            <p>{item.symbol}</p>
                            <p>{item.name}</p>
                          </div>
                          {item.balance ? (
                              <p style={{marginLeft: 'auto'}}>{formatAmount(item.balance, item.decimals)}</p>
                          ) : (
                              <img className="fetch__loading" style={{width: 12, marginRight: 0}} src={Circle} alt=""/>
                          )}
                        </div>
                    )
                  })
              ) : (
                  <img className="fetch__loading" src={Circle} alt=""/>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
