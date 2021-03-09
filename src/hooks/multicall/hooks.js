import {useEffect, useMemo, useState} from "react";
import {getContract, useActiveWeb3React, useBlockNumber} from "../../web3";
import {useMatterContract, useMulticallContract} from "../../web3/useContract";
import MainMatter from "../../web3/abi/MainMatter.json";
import {MATTER_ADDRESS} from "../../web3/address";
import {Web3Provider} from '@ethersproject/providers'

import {NetworkConnector} from "../../utils/NetworkConnector";

export function useSingleContractMultipleData(contract, methodName, callInputs, chainId, library) {
  const multicallContract = useMulticallContract(chainId, library)
  const {blockNumber} = useBlockNumber()
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])
  const calls = contract && fragment && callInputs && callInputs.length > 0
      ? callInputs.map(inputs => {
        return {
          address: contract.address,
          callData: contract.interface.encodeFunctionData(fragment, inputs)
        }
      }) : []
  return useMemo(() => {
    if (!multicallContract) return
    try {
      console.log('fetch multicall data', calls)
      multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData])).then(({resultsBlockNumber, returnData}) => {
        return returnData.map(data => {
          return contract.interface.decodeFunctionResult(fragment, data).toString()
        })
      })
    } catch (error) {
      console.debug('Failed to fetch chunk inside retry', error)
      throw error
    }
  }, [calls])

}


export const testETHNetwork1 = new NetworkConnector({
  urls: {[3]: 'https://ropsten.infura.io/v3/092b404ef4534f8e9f3acb4e047049c9'}
})

export const testETHNetwork2 = new NetworkConnector({
  urls: {[4]: 'https://rinkeby.infura.io/v3/092b404ef4534f8e9f3acb4e047049c9'}
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
  const [receivedList, setReceivedList] = useState()
  const contractFrom = getContract(getNetworkLibrary(chain1), MainMatter, MATTER_ADDRESS)
  const contractTo = getContract(getNetworkLibrary(chain2), MainMatter, MATTER_ADDRESS)
  const {account} = useActiveWeb3React()
  useEffect(() => {

    const query = () =>{

      console.log('contractFrom', contractFrom)
      contractFrom.sentCount(chain2, account).then( async res => {
        const queryData = []
        for (let i = 0; i < parseInt(res.toString()); i++) {
          queryData[i] = [parseInt(res.toString()) - (i+1)]
        }
        console.log('sentCount---->', chain1 ,queryData)

        const list = await Promise.all(queryData.map(async (item) => {
            const sendVolume = await contractFrom.sent(chain2, account, item)
            const reVolume = await contractTo.received(chain1, account, item)
          console.log('result---->', sendVolume.toString(), reVolume.toString())
          //     receivedList.push({nonce: i, fromChainId: chain1, toChainId: chain2, volume: sendData[i], received: receiveData[i] === sendData[i]})

          return {nonce: item, fromChainId: chain1, toChainId: chain2, volume: sendVolume.toString(), received: sendVolume.toString() === reVolume.toString()}
        }))
        setReceivedList(list)
      })
    }

    query()
  }, [account])
  // console.log('useReceivedList----->')
  // const {account} = useActiveWeb3React()
  // const contract = useMatterContract(getNetworkLibrary(chain1))
  // console.log('contract----->', account)
  // const data = useSingleContractMultipleData(contract, 'sentCount', [[chain2, account?account: ZERO_ADDRESS]])
  // console.log('count---->', data)
  //
  // const sentQuery = []
  // const receiveQuery = []
  // if (data) {
  //     for (let i = 0; i< parseInt(data); i++){
  //         sentQuery.push([chain2, account, i])
  //         receiveQuery.push([chain2, account, i])
  //     }
  // }
  // console.log('sentData', sentQuery)
  // const sendData = useSingleContractMultipleData(contract, 'sent', sentQuery, chain2, getNetworkLibrary(chain2))
  // console.log('sendData---->', sendData)
  // console.log('receiveQuery---->', receiveQuery)
  //
  // const receiveData = useSingleContractMultipleData(contract, 'received', receiveQuery, chain2, getNetworkLibrary(chain2))
  // console.log('receiveData---->', receiveData)
  // if (!receiveData || !sendData) return []
  //
  // const receivedList = []
  // for (let i = 0; i< parseInt(data); i++) {
  //     receivedList.push({nonce: i, fromChainId: chain1, toChainId: chain2, volume: sendData[i], received: receiveData[i] === sendData[i]})
  // }
  // return receivedList


  return receivedList
}

