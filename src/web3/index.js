import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import {useEffect, useMemo, useState} from "react";
import {useMulticallContract} from "./useContract";

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


function isMethodArg(x) {
    return ['string', 'number'].indexOf(typeof x) !== -1
}

function isValidMethodArgs(x){
    return (
        x === undefined ||
        (Array.isArray(x) && x.every(xi => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
    )
}

export const useSingleCallResult = (contract, methodName, inputs, options) =>{

    const {chainId, library} = options

    const [result, setResult] = useState()

    const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])

    const multicallContract = useMulticallContract(chainId, library)


    const calls = useMemo(() => {
        return contract && fragment && isValidMethodArgs(inputs)
            ? [
                {
                    address: contract.address,
                    callData: contract.interface.encodeFunctionData(fragment, inputs)
                }
            ]
            : []
    }, [contract, fragment, inputs])

    const fetchChunk = async ()=>{
        let resultsBlockNumber, returnData
        try {
            ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
            console.log('returnData', returnData)
            const results = returnData.map(item => {
                console.log('returnData', contract.interface.decodeFunctionResult(fragment, item))

                return contract.interface.decodeFunctionResult(fragment, item)
            })
            setResult(results?.[0])
        }catch (e) {
            throw e
        }
    }


    useEffect(() =>{
        if(!multicallContract) return
        fetchChunk()
    },[inputs])

    return result
}

export const useSingleContractMultipleData = (contract, methodName, callInputs, options) =>{
    const {chainId, library} = options

    const [result, setResult] = useState()

    const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])

    const multicallContract = useMulticallContract(chainId, library)

    const calls = useMemo(
        () =>
            contract && fragment && callInputs && callInputs.length > 0
                ? callInputs.map(inputs => {
                return {
                    address: contract.address,
                    callData: contract.interface.encodeFunctionData(fragment, inputs)
                }
            })
                : [],
        [callInputs, contract, fragment]
    )

    const fetchChunk = async ()=>{
        console.log('singlereturnData1', result, callInputs)

        if(result && result.length !== 0) return
        let resultsBlockNumber, returnData
        try {

            ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
            console.log('singlereturnData5',returnData)

            const results = returnData.map(item => {
                console.log('singlereturnData2', contract.interface.decodeFunctionResult(fragment, item))
                return contract.interface.decodeFunctionResult(fragment, item)
            })
            console.log('singlereturnData4',)
            setResult(results)
        }catch (e) {
            throw e
            console.log('singlereturnData3', e)

        }
    }



    useEffect(() =>{
        if(!multicallContract) return
        fetchChunk()
    },[callInputs])

    return result
}

export const useMultipleContractSingleData = (addresses, contractInterface, methodName, callInputs, options) =>{

    const {chainId, library} = options

    const [result, setResult] = useState()
    const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName])

    const multicallContract = useMulticallContract(chainId, library)

    const callData = useMemo(
        () =>
            fragment && isValidMethodArgs(callInputs)
                ? contractInterface.encodeFunctionData(fragment, callInputs)
                : undefined,
        [callInputs, contractInterface, fragment]
    )

    const calls = useMemo(
        () =>
            fragment && addresses && addresses.length > 0 && callData
                ? addresses.map(address => {
                return address && callData
                    ? {
                        address,
                        callData
                    }
                    : undefined
            })
                : [],
        [addresses, callData, fragment]
    )

    const fetchChunk = async ()=>{
        let resultsBlockNumber, returnData
        try {
            ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
            const results = returnData.map(item => {
                return contractInterface.decodeFunctionResult(fragment, item)
            })
            setResult(results)
        }catch (e) {
            throw e
        }
    }


    useEffect(() =>{
        if(!multicallContract) return
        fetchChunk()
    },[addresses])

    return  result
}


