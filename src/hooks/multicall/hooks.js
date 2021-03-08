import {useEffect, useMemo, useState} from "react";
import {useActiveWeb3React, useBlockNumber} from "../../web3";
import {useMulticallContract} from "../../web3/useContract";

export function useSingleContractMultipleData(contract, methodName, callInputs, options) {
    const multicallContract = useMulticallContract()
    const {blockNumber} = useBlockNumber()
    const {chainId} = useActiveWeb3React()
    const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])
    console.log('fragment', fragment)
    const [results, setResults] = useState()
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

    useEffect(()=>{
        console.log('multicallContract', multicallContract)

        if (!multicallContract) return
        try {
            console.log('fetch multicall data', calls)

            multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData])).then((resultsBlockNumber, returnData) =>{
                console.log('resultsBlockNumber', resultsBlockNumber)
                console.log('returnData', returnData)

            })
        } catch (error) {
            console.debug('Failed to fetch chunk inside retry', error)
            throw error
        }
    }, [chainId, blockNumber])

}
