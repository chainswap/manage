import {getContract, useActiveWeb3React} from "../../web3";
import {useEffect, useState} from "react";
import Offer from "../../web3/abi/Offer.json";
import {MATTER_ADDRESS, OFFERING_ADDRESS, USDT_ADDRESS} from "../../web3/address";
import ERC20 from "../../web3/abi/ERC20.json";

export const useQuota = () =>{
    const {account, active, chainId ,library} = useActiveWeb3React()
    const [ quota, setQuota] = useState()
    const [ volume, setVolume] = useState()
    const [ unLocked, setUnLocked] = useState()

    useEffect(()=>{
        if(active){
            try{
                const contract = getContract(library, Offer, OFFERING_ADDRESS(chainId))
                contract.methods.getQuota(account).call().then(res =>{
                    console.log('getQuota:',res)
                    setQuota(res)
                })
            }catch (e) {
                console.log('load token balance error:',e)

            }

            try{
                const contract = getContract(library, Offer, OFFERING_ADDRESS(chainId))
                contract.methods.getVolume(account).call().then(res =>{
                    console.log('getQuota:',res)
                    setVolume(res)
                })
            }catch (e) {
                console.log('load token balance error:',e)

            }

            try{
                const contract = getContract(library, Offer, OFFERING_ADDRESS(chainId))
                contract.methods.unlockCapacity(account).call().then(res =>{
                    console.log('getQuota:',res)
                    setUnLocked(res)
                })
            }catch (e) {
                console.log('load token balance error:',e)

            }

        }
    },[active, account])

    return {quota, volume, unLocked}
}

export const useAmount = () =>{
    const {account, active, chainId ,library} = useActiveWeb3React()
    const [ balance, setBalance] = useState()
    const [ allowance, setAllowance] = useState()

    useEffect(()=>{
        if(active){
            try{
                const contract = getContract(library, ERC20.abi, MATTER_ADDRESS(chainId));
                contract.methods.balanceOf(account).call().then(res =>{
                    console.log('getQuota:',res)
                    setBalance(res)
                })
            }catch (e) {
                console.log('load token balance error:',e)

            }

            try{
                const contract = getContract(library, ERC20.abi, USDT_ADDRESS(chainId));
                contract.methods.allowance(account, OFFERING_ADDRESS(chainId)).call().then(res =>{
                    console.log('getQuota:',res)
                    setAllowance(res)
                })
            }catch (e) {
                console.log('load token balance error:',e)

            }

        }
    },[active, account])

    return {balance, allowance}
}
