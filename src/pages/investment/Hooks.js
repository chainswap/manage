import {getContract, useActiveWeb3React} from "../../web3";
import {useEffect, useState} from "react";
import Offer from "../../web3/abi/Offer.json";
import {OFFERING_ADDRESS} from "../../web3/address";

export const useQuota = () =>{
    const {account, active, chainId ,library} = useActiveWeb3React()
    const [ quota, setQuota] = useState()

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

        }
    },[active, account])

    return {quota}
}
