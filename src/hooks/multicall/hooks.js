import {useEffect, useMemo, useState} from "react";
import {getContract, useActiveWeb3React, useBlockNumber, useSingleCallResult} from "../../web3";
import {useMatterContract, useMulticallContract} from "../../web3/useContract";
import MainMatter from "../../web3/abi/MainMatter.json";
import {ChainId, MATTER_ADDRESS} from "../../web3/address";
import {Web3Provider} from '@ethersproject/providers'

import {NetworkConnector} from "../../utils/NetworkConnector";
import useDeepCompareEffect from "use-deep-compare-effect";

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

export const ETHNetwork = new NetworkConnector({
  urls: {[1]: 'https://mainnet.infura.io/v3/3f6f55ba1ee540328662f8496ddbc228'}
})

export const testETHNetwork1 = new NetworkConnector({
  urls: {[3]: 'https://ropsten.infura.io/v3/3f6f55ba1ee540328662f8496ddbc228'}
})

export const testETHNetwork2 = new NetworkConnector({
  urls: {[4]: 'https://rinkeby.infura.io/v3/3f6f55ba1ee540328662f8496ddbc228'}
})

export const HECONetwork = new NetworkConnector({
  urls: {[128]: 'https://http-mainnet.hecochain.com'}
})

export const BSCNetwork = new NetworkConnector({
  urls: {[56]: 'https://bsc-dataseed4.binance.org'}
})

export const OKExNetwork = new NetworkConnector({
  urls: { 66: 'https://exchainrpc.okex.org' },
})


export function getNetworkLibrary(chainId) {
  switch (chainId) {
    case 1:
      return new Web3Provider(ETHNetwork.provider)
    case 3:
      return new Web3Provider(testETHNetwork1.provider)
    case 4:
      return new Web3Provider(testETHNetwork2.provider)
    case 56:
      return new Web3Provider(BSCNetwork.provider)
    case 66:
      return new Web3Provider(OKExNetwork.provider)
    case 128:
      return new Web3Provider(HECONetwork.provider)
    default:
  }
}


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const useReceivedList = (chain1, chain2, tokens) => {
  const [receivedList, setReceivedList] = useState()

  const {account} = useActiveWeb3React()
  const contractFrom = getContract(getNetworkLibrary(chain1), MainMatter, MATTER_ADDRESS)
  const contractTo = getContract(getNetworkLibrary(chain2), MainMatter, MATTER_ADDRESS)
  const chainIds = tokens.chains.map(item => {return item.chainId})

  useDeepCompareEffect(() => {
  return
    const query = () =>{
      console.log('query---->', chain1, chain2, tokens)
      contractFrom.sentCount(chain2, account).then( async res => {
        console.log('contractFrom', chain2, res.toString())

        const queryData = []
        for (let i = 0; i < parseInt(res.toString()); i++) {
          queryData[i] = [parseInt(res.toString()) - (i+1)]
        }
        console.log('sentCount---->', chain1 ,queryData)

        const list = await Promise.all(queryData.map(async (item) => {
          console.log('result---->')

          const sendVolume = await contractFrom.sent(chain2, account, item)
            const reVolume = await contractTo.received(chain1, account, item)
          console.log('result---->', sendVolume.toString(), reVolume.toString())
          return {nonce: item, fromChainId: chain1, toChainId: chain2, volume: sendVolume.toString(), received: sendVolume.toString() === reVolume.toString()}
        }))
        console.log('list--->', list)
        setReceivedList(list)
      })
    }

    if (chainIds.indexOf(chain1) !== -1 && chainIds.indexOf(chain2) !== -1){
      query()
    }
  }, [account, tokens, contractFrom, contractTo])

  return receivedList
}

export const useReceived = (token) => {
  console.log('receive  token', token)
  const tokens = token? token.chains  : []
  console.log('receive  tokens', tokens)


}


