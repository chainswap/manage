export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function getEtherscanLink(
    chainId,
    data,
    type
) {
  const prefix = chainId === 3 ? `https://ropsten.etherscan.io` :
      chainId === 4 ? `https://rinkeby.etherscan.io` :
          chainId === 128 ? `https://hecoinfo.com` :
              chainId === 56 ? `https://bscscan.com` : `https://etherscan.io`

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
