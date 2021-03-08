import {getContract, useActiveWeb3React} from "./index";
import {useMemo} from "react";
import {MATTER_ADDRESS, MULTICALL_NETWORKS} from "./address";
import Multicall from '../web3/abi/Multicall.json'
import MainMatter from '../web3/abi/MainMatter.json'

function useContract(address, ABI, withSignerIfPossible = true) {
    const { library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(library,  ABI, address, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function useMulticallContract() {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && MULTICALL_NETWORKS[chainId], Multicall, false)
}

export function useMatterContract() {
    const { chainId } = useActiveWeb3React()
    console.log('address--->', MATTER_ADDRESS[chainId])
    return useContract(MATTER_ADDRESS, MainMatter, true)
}