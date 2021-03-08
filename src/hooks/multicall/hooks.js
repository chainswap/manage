import {useEffect, useMemo, useState} from "react";
import {getContract, useActiveWeb3React, useBlockNumber} from "../../web3";
import {useMatterContract, useMulticallContract} from "../../web3/useContract";
import MainMatter from "../../web3/abi/MainMatter.json";
import {MATTER_ADDRESS} from "../../web3/address";
import { Web3Provider } from '@ethersproject/providers'

import {NetworkConnector} from "../../utils/NetworkConnector";

export function useSingleContractMultipleData(contract, methodName, callInputs) {
    const multicallContract = useMulticallContract()
    const {blockNumber} = useBlockNumber()
    const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])
    const [results, setResults] = useState()
    const calls = contract && fragment && callInputs && callInputs.length > 0
        ? callInputs.map(inputs => {
            return {
                address: contract.address,
                callData: contract.interface.encodeFunctionData(fragment, inputs)
            }
        }) : []
    useEffect(() => {
        if (!multicallContract) return
        try {
            console.log('fetch multicall data', calls)
            multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData])).then(({resultsBlockNumber, returnData}) => {
                const results = returnData.map(data => {return contract.interface.decodeFunctionResult(fragment, data).toString()})
                setResults(results)
            })
        } catch (error) {
            console.debug('Failed to fetch chunk inside retry', error)
            throw error
        }
    }, [blockNumber])

    return results
}


export const testETHNetwork1 = new NetworkConnector({
    urls: { [3]: 'https://ropsten.infura.io/v3/092b404ef4534f8e9f3acb4e047049c9' }
})

export const testETHNetwork2 = new NetworkConnector({
    urls: { [4]: 'https://rinkeby.infura.io/v3/092b404ef4534f8e9f3acb4e047049c9' }
})

export function getNetworkLibrary(chainId) {
    switch (chainId) {
        case 3:
            return new Web3Provider(testETHNetwork1.provider)
        case 4:
            return new Web3Provider(testETHNetwork2.provider)
        default:
    }
}


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const useReceivedList = (chain1, chain2) => {
    console.log('useReceivedList----->')

    const {account} = useActiveWeb3React()
    const contract = useMatterContract(getNetworkLibrary(chain1))
    console.log('contract----->', account)
    const data = useSingleContractMultipleData(contract, 'sentCount', [[chain2, account?account: ZERO_ADDRESS]])
    console.log('count---->', data)

    const sentQuery = []
    const receiveQuery = []
    if (data) {
        for (let i = 0; i< parseInt(data); i++){
            sentQuery.push([chain2, account, i])
            receiveQuery.push([chain2, account, i])
        }
    }
    console.log('sentData', sentQuery)
    const sendData = useSingleContractMultipleData(contract, 'sent', sentQuery)
    console.log('sendData---->', sendData)
    console.log('receiveQuery---->', receiveQuery)

    const receiveData = useSingleContractMultipleData(contract, 'received', receiveQuery)
    console.log('receiveData---->', receiveData)
    if (!receiveData || !sendData) return []

    const receivedList = []
    for (let i = 0; i< parseInt(data); i++) {
        receivedList.push({nonce: i, fromChainId: chain1, toChainId: chain2, volume: sendData[i], received: receiveData[i] === sendData[i]})
    }
    return receivedList
}

