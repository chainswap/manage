export const ChainId = {
    MAINNET: 1,
    ROPSTEN: 3,
    RINKEBY: 4,
    GÖRLI: 5,
    KOVAN: 42,
    BSC: 56,
    HT: 128
}

export function getGalleryAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x7Ff6440ec47827ecf5e438a17a2A8129b7c0e71b'
        case 4:
            return '0xCd4111dc072E82A7E0aE928e968845CB44018135'
        default:
            return '0x7Ff6440ec47827ecf5e438a17a2A8129b7c0e71b'
    }
}

// point token
export function getPointAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x9bB8eFe6fa366f74679839287e0b03821c3105b1'
        case 4:
            return '0xcFB82b27820d092137c985c476813553e7CC6132'
        default:
            return '0x9bB8eFe6fa366f74679839287e0b03821c3105b1'
    }
}

// GLF NFT
export function getGalleryNFTAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x95926757179d00f8154B0f7F2db0b7E8b0e7cef0'
        case 4:
            return '0xB85AE791393B89510Ab3405448Caf432B288c638'
        default:
            return '0x95926757179d00f8154B0f7F2db0b7E8b0e7cef0'
    }
}

// GLF NFT
export function getEnglishAuctionNFTAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0xA6D353fda6960cF774DbEc2F7BbD650d7098DEcD'
        case 4:
            return '0xfb0630AB838aB538b2C3C257DCD38E5d0C611b58'
        default:
            return '0xA6D353fda6960cF774DbEc2F7BbD650d7098DEcD'
    }
}

// GLF staking
export function getGLFStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x47fd85128312ee72aa0e0382a531a8f848b8b2cb'
        case 4:
            return '0xD7AD78B0B839cBE9B0f9bE0b10250779553a4411'
        case 31337:
            return '0xa4bcDF64Cdd5451b6ac3743B414124A6299B65FF'
        default:
            return '0x47fd85128312ee72aa0e0382a531a8f848b8b2cb'
    }
}

// BOT
export function getBotStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x75e0Ebd7CD13A9e2450bdf8736Eb8e4Cee5f01F7'
        case 4:
            return '0x9A3fbFb03A09c5A37fce01F72785D79cC7c4A615'
        default:
            return '0x75e0Ebd7CD13A9e2450bdf8736Eb8e4Cee5f01F7'
    }
}

export function getBotAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x5beabaebb3146685dd74176f68a0721f91297d37'
        case 4:
            return '0x5f38939F667922E8577558ff5819B071Ef6FcE11'
        default:
            return '0x5beabaebb3146685dd74176f68a0721f91297d37'
    }
}

//ETH

export function getETHStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0xec3EACCe7E4661f090Ca27C2e9CC34Ce7FA6D777'
        case 4:
            return '0x30Ce9CC5559C68123DDbC3B5fDBAE1F35136592E'
        default:
            return '0xec3EACCe7E4661f090Ca27C2e9CC34Ce7FA6D777'
    }
}

export function getETHAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x710980bb4a0866e9ec162ccd84439dda5a04b99c'
        case 4:
            return '0x23e146dA21B19aCe4a7E0bfdC147aEe8D8C2D3B9'
        default:
            return '0x710980bb4a0866e9ec162ccd84439dda5a04b99c'
    }
}

// USDT

export function getUSDTStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x9D71ECa535236f956124f0243cfEd3f8d637FD68'
        case 4:
            return '0xef7F8B2e37A6601469eBDd8773f0b57a2Cd8A7d7'
        default:
            return '0x9D71ECa535236f956124f0243cfEd3f8d637FD68'
    }
}

export function getUSDTAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x8f9655df094f805a61ee691109215fc004efea92'
        case 4:
            return '0xBAd2F0118957B1ED856F0c8009f25FdEF27d27EF'
        default:
            return '0x8f9655df094f805a61ee691109215fc004efea92'
    }
}

// DEGO

export function getDEGOStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x8AFA9865cE1150899b84a4D7583CFdf352e25333'
        case 4:
            return '0xeBC86f913Db01CFd7dEE04F601A2555506224CE5'
        default:
            return '0x8AFA9865cE1150899b84a4D7583CFdf352e25333'
    }
}

export function getDEGOAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x88ef27e69108b2633f8e1c184cc37940a075cc02'
        case 4:
            return '0x94FfAb9264b5f0CC4A177b22D1C08a2AEc62e5e7'
        default:
            return '0x88ef27e69108b2633f8e1c184cc37940a075cc02'
    }
}

// MEMO

export function getMEMOStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0xfDD54D77551C66684Ce73A696ac866F2AF3292Fc'
        case 4:
            return '0x24078c06d62D121D07E3Cfbbe40Ca11bdA44Fff5'
        default:
            return '0xfDD54D77551C66684Ce73A696ac866F2AF3292Fc'
    }
}

export function getMEMOAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0xd5525d397898e5502075ea5e830d8914f6f0affe'
        case 4:
            return '0x40ba0942e9F9764143C68Da87d41D1515D108400'
        default:
            return '0xd5525d397898e5502075ea5e830d8914f6f0affe'
    }
}


// DONUT

export function getDONUTStakingAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x97073Ba28923491f9c0445824e124af41A2b5EB7'
        case 4:
            return '0xa636AadAd4D8487BbEC7fE10446dedaC3e94d0d8'
        default:
            return '0x97073Ba28923491f9c0445824e124af41A2b5EB7'
    }
}

export function getDONUTAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9'
        case 4:
            return '0x1ddae7FdB2e7fFeE4005913a48a0E3CED1f5AEa0'
        default:
            return '0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9'
    }
}

export function getStakingScoreAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x0c6343eD7635F6090dfE6e0A63c70bbd395d8AcA'
        case 4:
            return '0x623c421B3af650BBa09E585a1Edb0617D9972a28'
        default:
            return '0x0c6343eD7635F6090dfE6e0A63c70bbd395d8AcA'
    }
}

export function getFigureSwapAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x92b1Bb455cdD4a339cfC55CDF3F99A807F3daE4F'
        case 4:
            return '0x3d0cd0BfB1476d6d32D71F662f89f9FB2C2674B8'
        default:
            return '0x92b1Bb455cdD4a339cfC55CDF3F99A807F3daE4F'
    }
}

export function getNFTAddress(chainId) {
    switch (chainId) {
        case 1:
            return 'https://etherscan.io/address/0x95926757179d00f8154B0f7F2db0b7E8b0e7cef0'
        case 4:
            return 'https://rinkeby.etherscan.io/address/0xB85AE791393B89510Ab3405448Caf432B288c638'
        default:
            return 'https://etherscan.io/address/0x95926757179d00f8154B0f7F2db0b7E8b0e7cef0'
    }
}


export function getUSDTTokenAddress() {
    return '0xdac17f958d2ee523a2206206994597c13d831ec7'
}

export function getNFTTokenAddress(chainId) {
    switch (chainId) {
        case 1:
            return '0x27862ac434f06998a3dd40cb64a8400a39148750'
        case 4:
            return '0xD99E5262090274468D6A9d91a290d35BC07aA4fD'
        case 31337:
            return '0xb682dEEf4f8e298d86bFc3e21f50c675151FB974'
        default:
            throw new Error('unknown chain')
    }
}

export function ETH_ADDRESS(chainId) {
    switch (chainId) {
        case 1:
            return '0xB65853Ddc2366564e2238c70a0676B886c79dD9b'
        case 4:
            return '0xB65853Ddc2366564e2238c70a0676B886c79dD9b'
        default:
            throw new Error('unknown chain')
    }
}

export function ETH_POOL_ADDRESS(chainId) {
    switch (chainId) {
        case 1:
            return '0xB65853Ddc2366564e2238c70a0676B886c79dD9b'
        case 4:
            return '0xB65853Ddc2366564e2238c70a0676B886c79dD9b'
        default:
            throw new Error('unknown chain')
    }
}

export function WETH_ADDRESS(chainId) {
    switch (chainId) {
        case 1:
            return '0xc778417e063141139fce010982780140aa0cd5ab'
        case 3:
            return '0xc778417e063141139fce010982780140aa0cd5ab'
        case 128:
            return '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
        default:
            throw new Error('unknown chain')
    }
}

export function USDT_ADDRESS(chainId) {
    switch (chainId) {
        case 1:
            return '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        case 3:
            return '0x17cdbae3ae402da0886f95a7402a181ce465c41c'
        default:
            return '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    }
}


export function OFFERING_ADDRESS(chainId) {
    switch (chainId) {
        case 1:
            return '0x6c9d4B938A119f91e7eEaCd97cB4BEd2b8F5D1af'
        case 3:
            return '0x6c9d4B938A119f91e7eEaCd97cB4BEd2b8F5D1af'
        default:
            return '0x6c9d4B938A119f91e7eEaCd97cB4BEd2b8F5D1af'
    }
}


export function MAPPED_ADDRESS(chainId) {
    switch (chainId) {
        case 1:
            return '0x994013d05302eef18372b749088F1513f3D27E23'
        case 3:
            return '0x994013d05302eef18372b749088F1513f3D27E23'
        default:
            return '0x994013d05302eef18372b749088F1513f3D27E23'
    }
}

export const MATTER_ADDRESS = '0x1C9491865a1DE77C5b6e19d2E6a5F1D7a6F2b25F'

const MULTICALL_NETWORKS = {
    [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
    [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
    [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
    [ChainId.BSC]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
    [ChainId.HT]: '0x37ab26db3df780e7026f3e767f65efb739f48d8e'
}


const TOKEN_FACTORY = '0xBF515ff38D55737C56D62E8B6a8eea322Ec38Aa5'


export { MULTICALL_NETWORKS, TOKEN_FACTORY }
