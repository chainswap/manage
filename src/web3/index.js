import {useWeb3React as useWeb3ReactCore} from '@web3-react/core'
import {Contract} from '@ethersproject/contracts'
import {useEffect, useMemo, useState} from "react";
import {useMulticallContract} from "./useContract";
import useDeepCompareEffect from 'use-deep-compare-effect'

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(library, abi, address, account) {
  return new Contract(address, abi, getProviderOrSigner(library, account))
}

export const useActiveWeb3React = () => {
  const context = useWeb3ReactCore()
  return context
}

export const useBlockNumber = () => {
  const [blockNumber, setBlockNumber] = useState(0)
  const {library} = useWeb3ReactCore()
  const updateBlockNumber = (blockNumber) => {
    setBlockNumber(blockNumber)
  }

  useEffect(() => {
    if (library) {
      library.once('block', updateBlockNumber)
    }
    library && library.getBlockNumber().then((res) => {
    })
    return () => {
      library && library.off('block', updateBlockNumber)
    }
  }, [blockNumber, library])

  return {blockNumber}
}

export const useChainBlockNumber = (library) => {
  const [blockNumber, setBlockNumber] = useState(0)
  const updateBlockNumber = (blockNumber) => {
    setBlockNumber(blockNumber)
  }

  useDeepCompareEffect(() => {
    if (library) {
      library.once('block', updateBlockNumber)
    }
    library && library.getBlockNumber().then((res) => {
    })
    return () => {
      library && library.off('block', updateBlockNumber)
    }
  }, [blockNumber, library])

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

function isValidMethodArgs(x) {
  return (
      x === undefined ||
      (Array.isArray(x) && x.every(xi => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  )
}

export const useSingleCallResult = (contract, methodName, inputs, options) => {

  const {chainId, library} = options

  const [result, setResult] = useState()

  const multicallContract = useMulticallContract(chainId, library)

  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName])
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

  const fetchChunk = async () => {

    let resultsBlockNumber, returnData
    try {
      ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
      const results = returnData.map(item => {
        return contract.interface.decodeFunctionResult(fragment, item)
      })
      setResult(results?.[0])
    } catch (e) {
      console.log('error--->')
      throw e
    }
  }


  useDeepCompareEffect(() => {
    if (!multicallContract) return
    fetchChunk()
  }, [calls])

  return result
}

export const useSingleContractMultipleData = (contract, methodName, callInputs, options) => {
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

  const fetchChunk = async () => {

    let resultsBlockNumber, returnData
    try {

      ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))

      const results = returnData.map(item => {
        return contract.interface.decodeFunctionResult(fragment, item)
      })
      setResult(results)
    } catch (e) {
      throw e
      console.log('singlereturnData3', e)
    }
  }


  useDeepCompareEffect(() => {
    if (!multicallContract || calls.length === 0) return
    fetchChunk()
  }, [calls])

  return result
}

export const useMultipleContractSingleData = (addresses, contractInterface, methodName, callInputs, options) => {

  const {blockNumber} = useBlockNumber()

  const chainId = options?.chainId
  const library = options?.library

  const defaultChainId = useActiveWeb3React().chainId
  const defaultLibrary = useActiveWeb3React().library


  const [result, setResult] = useState()
  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName])

  const multicallContract = useMulticallContract(chainId ? chainId : defaultChainId, library ? library : defaultLibrary)

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

  const fetchChunk = async () => {
    let resultsBlockNumber, returnData
    try {
      ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
      const results = returnData.map(item => {
        return contractInterface.decodeFunctionResult(fragment, item)
      })
      setResult(results)
    } catch (e) {
      throw e
    }
  }


  useDeepCompareEffect(() => {
    if (!multicallContract || !blockNumber) return
    fetchChunk()
  }, [calls, blockNumber])

  return result
}


export const getSingleCallResult = async (multicallContract, contract, methodName, inputs) => {
  const fragment = contract?.interface?.getFunction(methodName)
  const calls = contract && fragment && isValidMethodArgs(inputs)
      ? [
        {
          address: contract.address,
          callData: contract.interface.encodeFunctionData(fragment, inputs)
        }
      ]
      : []


  let resultsBlockNumber, returnData
  try {
    ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
    const results = returnData.map(item => {
      return contract.interface.decodeFunctionResult(fragment, item)
    })
    return results?.[0]
  } catch (e) {
    console.log('error--->')
    throw e
  }

}

export const getSingleContractMultipleData = async (multicallContract, contract, methodName, callInputs) => {

  const fragment = contract?.interface?.getFunction(methodName)


  const calls = contract && fragment && callInputs && callInputs.length > 0
      ? callInputs.map(inputs => {
        return {
          address: contract.address,
          callData: contract.interface.encodeFunctionData(fragment, inputs)
        }
      })
      : []


  let resultsBlockNumber, returnData
  try {

    ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))

    const results = returnData.map(item => {
      return contract.interface.decodeFunctionResult(fragment, item)
    })
    return results
  } catch (e) {
    console.log('singlereturnData3', e)
    throw e
  }
}

export const getMultipleContractSingleData = async (multicallContract, addresses, contractInterface, methodName, callInputs, options) => {

  const fragment = contractInterface.getFunction(methodName)

  const callData = fragment && isValidMethodArgs(callInputs)
      ? contractInterface.encodeFunctionData(fragment, callInputs)
      : undefined


  const calls =
          fragment && addresses && addresses.length > 0 && callData
              ? addresses.map(address => {
                return address && callData
                    ? {
                      address,
                      callData
                    }
                    : undefined
              })
              : []


    let resultsBlockNumber, returnData
    try {
      ;[resultsBlockNumber, returnData] = await multicallContract.aggregate(calls.map(obj => [obj.address, obj.callData]))
      const results = returnData.map(item => {
        return contractInterface.decodeFunctionResult(fragment, item)
      })
      return results
    } catch (e) {
      throw e
    }
}
