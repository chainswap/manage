import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import Web3 from "web3";
import {useEffect, useState} from "react";

export function getSigner(library, account) {
    return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
    return account ? getSigner(library, account) : library
}

export function getContract(library, abi, address, account) {
    return  new Contract(address, abi, getProviderOrSigner(library, account))
}

export const useActiveWeb3React =() => {
    const context = useWeb3ReactCore()
    return context
}

export const useBlockNumber =() => {
    const [blockNumber, setBlockNumber] = useState(0)
    const {library} = useWeb3ReactCore()
    const updateBlockNumber = (blockNumber) =>{
        setBlockNumber(blockNumber)
    }

    useEffect(()=>{
        if(library){
            library.once('block', updateBlockNumber)
        }
        library && library.getBlockNumber().then((res)=>{
        })
        return ()=>{
            library && library.off('block', updateBlockNumber)
        }
    },[blockNumber, library])

    return {blockNumber}
}

export const useChainBlockNumber =(library) => {
    const [blockNumber, setBlockNumber] = useState(0)
    const updateBlockNumber = (blockNumber) =>{
        setBlockNumber(blockNumber)
    }

    useEffect(()=>{
        if(library){
            library.once('block', updateBlockNumber)
        }
        library && library.getBlockNumber().then((res)=>{
        })
        return ()=>{
            library && library.off('block', updateBlockNumber)
        }
    },[blockNumber, library])

    return blockNumber
}

// 'transaction' | 'token' | 'address' | 'block'
export function getEtherscanLink(
    chainId,
    data,
    type
) {
    const prefix = `https://scan.hecochain.com`

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`
        }
        case 'token': {
            return `${prefix}/token/${data}`
        }
        case 'block': {
            return `${prefix}/block/${data}`
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`
        }
    }
}
