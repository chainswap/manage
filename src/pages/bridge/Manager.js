import React, {useContext, useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import Lottie from "react-lottie";

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useTokenList} from "../Hooks";
import {getContract} from "../../web3";
import {getNetworkLibrary} from "../../hooks/multicall/hooks";
import MainMatter from '../../web3/abi/MainMatter.json'
import {TOKEN_FACTORY} from "../../web3/address";
import {formatAmount, numToWei} from "../../utils/format";
import BigNumber from "bignumber.js";
import Animation from "../../assets/loading.json";
import {mainContext} from "../../reducer";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Animation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const Manager = () => {
    const [list, setList] = useState([])
    const { tokens } = useContext(mainContext).state
    console.log('tokens---->', tokens)

    const fetchData = async () => {
        const list = await Promise.all(tokens.map(async (item) => {
            const amounts = await Promise.all(item.chains.map(async chain => {
                const contract = getContract(getNetworkLibrary(chain.chainId), MainMatter, chain.address)
                const amount1 = await contract.authQuotaOf('0x8C46b006D1c01739E8f71119AdB8c6084F739359')
                const amount2 = await contract.authQuotaOf('0xAf700fb5db461c142fefe832d5DB02C8e34696EA')
                const amount3 = await contract.authQuotaOf('0x4F559d3c39C3F3d408aFBFB27C44B94badA8dEd5')
                const amount4 = await contract.authQuotaOf('0xaB97039e4481BB4627bbB9e4585bBb9828f21582')
                const amount5 = await contract.authQuotaOf('0x6EA6D36d73cF8ccD629Fbc5704eE356144A89A06')
                console.log('amount1', formatAmount(amount1.toString()))
                return {
                    chainId: chain.chainId, amounts: [
                        {address: '0x8C46b006D1c01739E8f71119AdB8c6084F739359', amount: amount1},
                        {address: '0xAf700fb5db461c142fefe832d5DB02C8e34696EA', amount: amount2},
                        {address: '0x4F559d3c39C3F3d408aFBFB27C44B94badA8dEd5', amount: amount3},
                        {address: '0xaB97039e4481BB4627bbB9e4585bBb9828f21582', amount: amount4},
                        {address: '0x6EA6D36d73cF8ccD629Fbc5704eE356144A89A06', amount: amount5}
                    ]
                }
            }))

            return {symbol: item.symbol, amounts}
        }))
        setList(list)
        console.log('list--->', list)
    }

    useEffect(() => {
        if (tokens) {
            fetchData()
        }
    }, [tokens])


    return (
        <div>
            {list.length !== 0 ? list.map(item => {
                return (
                    <ListItem style={{width: 1370}}>
                        <ListItemText primary={`${item.symbol}`} secondary={
                            <ListItem>
                                {item.amounts.map(amounts => {
                                    return (
                                        <ListItemText style={{color: '#fff'}} primary={`${amounts.chainId}`} secondary={
                                            amounts.amounts.map(amount => {
                                                return (
                                                    <ListItem>
                                                        <ListItemText
                                                            style={{color: new BigNumber(amount.amount.toString()).isGreaterThan(numToWei(3000)) ? 'white' : 'red'}}
                                                            primary={
                                                                <div>
                                                                    <div>{amount.address}</div>
                                                                    <h2>{formatAmount(amount.amount.toString(), 18, 0)}</h2>
                                                                </div>
                                                            }/>
                                                    </ListItem>)
                                            })
                                        }/>
                                    )
                                })}
                            </ListItem>
                        }/>
                    </ListItem>
                )
            }) : <div style={{height: '100vh', display: 'flex', alignItems: 'center'}}>
                <Lottie width={'100%'} height={236} options={defaultOptions}/>
            </div>}
        </div>
    )
}
