import {getContract, useActiveWeb3React} from "./index";
import {useMemo} from "react";
import {MATTER_ADDRESS, MULTICALL_NETWORKS} from "./address";
import Multicall from '../web3/abi/Multicall.json'
import MainMatter from '../web3/abi/MainMatter.json'

function useContract(address, ABI, withSignerIfPossible = true, defaultLibrary) {
    const { library, account } = useActiveWeb3React()
    return useMemo(() => {
        if (!address || !ABI || (!library && !defaultLibrary)) return null
        try {
            return getContract(defaultLibrary? defaultLibrary :library,  ABI, address, withSignerIfPossible && account ? account : undefined)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account, defaultLibrary])
}

export function useMulticallContract(chainId, library) {
    return useContract(chainId && MULTICALL_NETWORKS[chainId], Multicall, false, library)
}

export function useMatterContract(library) {
    return useContract(MATTER_ADDRESS, MainMatter, true, library)
}
