import { getAddress } from '@ethersproject/address'

export function isAddress(value) {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}