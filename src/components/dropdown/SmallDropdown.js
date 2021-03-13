import React, {useEffect, useState} from 'react'
import {ReactComponent as ETH} from '../../assets/icon/eth.svg'
import {ReactComponent as Binance} from '../../assets/icon/binance.svg'
import {ReactComponent as Huobi} from '../../assets/icon/huobi.svg'
import ETH_logo from '../../assets/icon/eth.svg'
import Binnace_logo from '../../assets/icon/binance.svg'
import Huobi_logo from '../../assets/icon/huobi.svg'
export const CHAIN = [
    {id: 0, title: 'ETH', chainId: 1 ,logo: <ETH className="icon"/>, icon: ETH_logo},
    {id: 1, title: 'BSC',chainId: 56, logo: <Binance className="icon"/>, icon: Binnace_logo},
    {id: 2, title: 'HECO',chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo},
    {id: 3, title: 'Ropsten',chainId: 3, logo: <ETH className="icon"/>, icon: ETH_logo},
    {id: 4, title: 'Rinkeby',chainId: 4, logo: <ETH className="icon"/>, icon: ETH_logo}
]

export const SmallDropDown = ({index, onSelect, options}) => {

    const [selectedChain, setSelectedChain] = useState(index)

    useEffect(()=>{
        setSelectedChain(index)
    },[index])
    return (
        <nav role={`navigation`} className={`active-${selectedChain} small_drop`}>
            <ul>
                {options.map((item, index) => {
                    return (
                        <li onClick={() => {
                            setSelectedChain(index)
                            onSelect(item)
                        }}>
                            <a tabIndex={item.id}><img className="icon" src={item.icon}/>{item.title}</a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
