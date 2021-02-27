import BigNumber from 'bignumber.js'
import Web3 from 'web3'

BigNumber.config({EXPONENTIAL_AT: [-20, 40]})

export const formatAddress = (address, start=6, end = -3)=>{
    return  address.slice(0, start) + '...' + address.slice(end)
}

export const formatAmount = (value, decimals = 18, fixed = 6) => {
    return new BigNumber(fromWei(value, decimals).toFixed(fixed === -1 ? null : fixed, 1)).toNumber().toString()
};

export const numToWei = (value, decimals = 18) => {
    return new BigNumber(toWei(value, decimals).toNumber().toFixed(decimals)).toString()
};

export const fromWei = (value, decimals = 18) => {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals))
}

const toWei = (value, decimals) => {
    return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))
}

export const weiPlus = (value1,  value2)=>{
    console.log('weiPlus',value1, value2)
    return new BigNumber(new BigNumber(value1? value1: 0).plus(new BigNumber(value2? value2: 0)).toFixed(6)).toNumber().toString()
}


export const weiDiv = (value1, value2) => {
    if(value1 == 0 || value2 == 0){
        return  0
    }
    console.log('weiDiv',value1, value2)
    return new BigNumber(new BigNumber(value1).dividedBy(new BigNumber(value2)).toFixed(6)).multipliedBy(100).toString()
};
