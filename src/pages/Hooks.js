import {useState, useEffect, useContext, useCallback, useMemo} from 'react';
import StakingRewardsV2 from '../web3/abi/StakingRewardsV2.json'
import ERC20 from '../web3/abi/ERC20.json'
import {getContract, useActiveWeb3React, useBlockNumber, useChainBlockNumber} from "../web3";
import {getGLFStakingAddress, MATTER_ADDRESS} from "../web3/address";
import {mainContext} from "../reducer";
import {ANTIMATTER_TRANSACTION_LIST, HANDLE_POPUP_LIST} from "../const";
import {BigNumber} from "bignumber.js";

export const useGLFBalance = () => {
    const {account, active, library, chainId} = useActiveWeb3React()
    const [glfBalance, setGLFBalance] = useState()

    useEffect(() => {
        if (active) {
            try {
                const contract = getContract(library, StakingRewardsV2.abi, getGLFStakingAddress(chainId))
                contract.balanceOf(account).then(res => {
                    console.log('bot totalSupply:', res)
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
    const {account, active, library, chainId} = useActiveWeb3React()
    const {blockNumber} = useBlockNumber()
    const [balance, setBalance] = useState()

    useEffect(() => {
        if (active && chainId) {
            try {
                const contract = getContract(library, ERC20.abi, address)
                contract.balanceOf(account).then(res => {
                    setBalance(res.toString())
                })
            } catch (e) {
                console.log('load token balance error:', e)
            }
        }
    }, [active, chainId, address ,blockNumber])

    return balance
}

export const useTransactionAdder = () => {
    const {chainId} = useActiveWeb3React()
    const {dispatch} = useContext(mainContext);
    return useCallback((response, customData) => {
        console.log('useTransactionAdder', response, customData)
        if (!response) return
        const {hash} = response
        const {summary, stake, claim} = customData
        const now = () => new Date().getTime()
        dispatch({
            type: ANTIMATTER_TRANSACTION_LIST,
            transaction: {hash, chainId, summary, stake, claim, addedTime: now()}
        })
    }, [])
}

export const TransactionsUpdater = () => {
    const {dispatch} = useContext(mainContext);
    const {chainId, library} = useActiveWeb3React()
    const {blockNumber} = useBlockNumber()
    const {transactions} = useContext(mainContext).state;
    useEffect(() => {
        console.log('transactions---->', transactions)
        if (!chainId || !library || !blockNumber) return
        transactions
            .filter(item => {
                return !item.receipt && new Date().getTime() - item.addedTime < 86_400_000
            })
            .forEach(tx => {
                library
                    .getTransactionReceipt(tx.hash)
                    .then(receipt => {
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
                                        transactionHash: receipt.transactionHash,
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
