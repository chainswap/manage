import {useState, useEffect, useContext, useCallback, useMemo} from 'react';
import StakingRewardsV2 from '../web3/abi/StakingRewardsV2.json'
import {
    getContract,
    useActiveWeb3React,
    useBlockNumber, useMultipleContractSingleData,
    useSingleCallResult,
    useSingleContractMultipleData
} from "../web3";
import { Interface } from '@ethersproject/abi'

import {ChainId, getGLFStakingAddress, TOKEN_FACTORY} from "../web3/address";
import {mainContext} from "../reducer";
import {ANTIMATTER_TRANSACTION_LIST, HANDLE_POPUP_LIST} from "../const";
import {BigNumber} from "bignumber.js";
import {getNetworkLibrary} from "../hooks/multicall/hooks";
import TokenFactory from '../web3/abi/TokenFactory.json'
import {CHAIN} from "../components/dropdown";
import ERC20 from '../web3/abi/ERC20.json'
const ERC20_INTERFACE = new Interface(ERC20)


export const useGLFBalance = () => {
    const {account, active, library, chainId} = useActiveWeb3React()
    const [glfBalance, setGLFBalance] = useState()

    useEffect(() => {
        if (active) {
            try {
                const contract = getContract(library, StakingRewardsV2.abi, getGLFStakingAddress(chainId))
                contract.balanceOf(account).then(res => {
                    setGLFBalance(res)
                })
            } catch (e) {
                console.log('load totalSupply error:', e)
            }

        }
    }, [active])

    return {glfBalance}
}

export const useBalance = (address) => {
    console.log('address--->',address)
    const {account, active, library, chainId} = useActiveWeb3React()
    const {blockNumber} = useBlockNumber()
    const [balance, setBalance] = useState()

    useEffect(() => {
        console.log('address--->1',address)

        if (active && chainId) {
            try {
                const contract = getContract(library, ERC20, address)
                contract.balanceOf(account).then(res => {
                    setBalance(res.toString())
                })
            } catch (e) {
                console.log('load token balance error:', e)
            }
        }
    }, [active, chainId, address ,blockNumber, account])

    return balance
}

export const useTransactionAdder = () => {
    const {chainId} = useActiveWeb3React()
    const {dispatch} = useContext(mainContext);
    return useCallback((response, customData) => {
        if (!response) return
        const {hash} = response
        const {summary, stake, claim, hashLink} = customData
        const now = () => new Date().getTime()
        dispatch({
            type: ANTIMATTER_TRANSACTION_LIST,
            transaction: {hash, chainId, summary, stake, claim, hashLink ,addedTime: now()}
        })
    }, [])
}

export const TransactionsUpdater = () => {
    const {dispatch} = useContext(mainContext);
    const {chainId, library} = useActiveWeb3React()
    const {blockNumber} = useBlockNumber()
    const {transactions} = useContext(mainContext).state;
    useEffect(() => {
        if (!chainId || !library || !blockNumber) return
        transactions
            .filter(item => {
                return !item.receipt && new Date().getTime() - item.addedTime < 86_400_000
            })
            .forEach(tx => {
                console.log('tx---->', tx)
                console.log('hash---->', tx.hash)

                getNetworkLibrary(chainId)
                    .getTransactionReceipt(tx.hash)
                    .then(receipt => {
                        console.log('receipt---->', receipt)

                        if (receipt) {
                            dispatch({
                                type: ANTIMATTER_TRANSACTION_LIST, transaction: {
                                    ...tx,
                                    stake: tx.stake? {...tx.stake, status: receipt.status === 1 ? 1 : 0} :null,
                                    claim: tx.claim? {...tx.claim, status: receipt.status === 1 ? 1 : 0} :null,
                                    nonce: tx.stake? new BigNumber(receipt.logs[1].data.substring(0, 66)).toString() : null,
                                    receipt: {
                                        blockHash: receipt.blockHash,
                                        blockNumber: receipt.blockNumber,
                                        contractAddress: receipt.contractAddress,
                                        from: receipt.from,
                                        status: receipt.status,
                                        to: receipt.to,
                                        transactionHash: tx.hash,
                                        transactionIndex: receipt.transactionIndex
                                    }
                                }
                            })
                            dispatch({
                                type: HANDLE_POPUP_LIST,
                                auction: 'add',
                                popup: {
                                    key: receipt.transactionHash,
                                    popKey: receipt.transactionHash,
                                    hash: receipt.transactionHash,
                                    hashLink: tx.hashLink,
                                    summary: tx.summary,
                                    success: receipt.status === 1
                                }
                            })
                        } else {

                        }
                    })
            })
    }, [chainId, blockNumber, transactions])
    return null
}

export const useHasDeposite = () => {
    const {chainId, account} = useActiveWeb3React()
    const {transactions} = useContext(mainContext).state;

    return useMemo(() => {

        if (chainId && account && transactions.length !== 0) {
            console.log('curDeposite', transactions)
            return false
        } else {
            return false
        }
    }, [transactions, chainId, account])
}

export const useRemovePopup = () => {
    const {dispatch} = useContext(mainContext);

    return useCallback((key) => {
            dispatch({type: HANDLE_POPUP_LIST, auction: 'remove', popup: {key: key, popKey: key, hash: key}})
        },
        [dispatch]
    )
}


export const useTokenList = () =>{
    const {account} = useActiveWeb3React()
    const tokenFactoryContract = getContract(getNetworkLibrary(3), TokenFactory, TOKEN_FACTORY[ChainId.ROPSTEN])
    const options = {chainId: ChainId.ROPSTEN, library: getNetworkLibrary(3)}
    const tokens =  useSingleCallResult(tokenFactoryContract, 'allCertifiedTokens', undefined, options)

    const names = useMultipleContractSingleData(tokens? tokens.tokens: [],ERC20_INTERFACE, 'name', undefined, options)

    const balances = useMultipleContractSingleData(tokens? tokens.tokens: [],ERC20_INTERFACE, 'balanceOf', [account], options)

    console.log('mappingTokens--->call', tokens? tokens.tokens.map(item => {return [item]}):[] )

    const mappingTokens = useSingleContractMultipleData(tokenFactoryContract, 'chainIdMappingTokenMappeds',tokens? tokens.tokens.map(item => {return [item]}):[] , options)
    console.log('mappingTokens--->result', mappingTokens)

    return useMemo(()=>{
        return tokens ? tokens.symbols.map((item, index) =>{
            console.log('chains---->', mappingTokens?.[index]?.['chainIds'])
            return {
                symbol: item,
                address: tokens.tokens[index],
                chainId: tokens.chainIds[index].toString(),
                name: names?.[index],
                balance: balances?.[index]?.['balance'].toString(),
                chains: mappingTokens?.[index]?.['chainIds'].map((item, subIndex) => {
                    return {chainId: parseInt(item).toString(), address: mappingTokens?.[index]?.['mappingTokenMappeds_'][subIndex]}
                })
            }
        }) : []
    },[tokens, names, balances, mappingTokens])
}
