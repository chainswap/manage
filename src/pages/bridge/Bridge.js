import React, {useEffect, useState} from 'react'
import {CHAIN, DropDown} from "../../components/dropdown";
import Exchange from '../../assets/icon/exchange.svg'
import Matter from '../../assets/icon/matter.svg'
import {useBalance} from "../Hooks";
import {MATTER_ADDRESS} from "../../web3/address";
import {useWeb3React} from "@web3-react/core";
import {formatAddress, formatAmount, numToWei} from "../../utils/format";
import LogoLineWhite from "../../assets/image/logo-line-white.svg";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ReactComponent as Copy} from "../../assets/icon/copy.svg";
import {GALLERY_SELECT_WEB3_CONTEXT} from "../../const";
import metamask from "../../assets/icon/metamask.png";
import walletConnect from "../../assets/icon/walletConnect.png";
import {InjectedConnector} from "@web3-react/injected-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import BigNumber from "bignumber.js";
import ETH from '../../assets/icon/eth.svg'
import Binance from '../../assets/icon/binance.svg'
import Huobi from '../../assets/icon/huobi.svg'
import ArrowLeft from '../../assets/icon/arrow-left.svg'
import {getContract} from "../../web3";
import ERC20 from "../../web3/abi/ERC20.json";
import SubMatter from "../../web3/abi/SubMatter.json";
import MainMatter from "../../web3/abi/MainMatter.json";
import {isAddress} from "../../utils/address";
import {ReactComponent as Close} from '../../assets/icon/close.svg'
import Success from "../../assets/icon/success.svg";
import Circle from "../../assets/icon/circle.svg";
import Binnace_logo from "../../assets/icon/binance.svg";
import Huobi_logo from "../../assets/icon/huobi.svg";
import ETH_logo from "../../assets/icon/eth.svg";


const MODE_TYPE = {
    INIT: 'INIT',
    WALLETS: 'WALLETS',
    PROFILE: 'PROFILE',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    CONNECT_ERROR: "CONNECT_ERROR",
    SWITCH_CHAIN: "SWITCH_CHAIN",
    NOT_ELIGIBLE: "NOT_ELIGIBLE",
    CONTRIBUTE_SUCCESS: "CONTRIBUTE_SUCCESS",
    CONTRIBUTED: "CONTRIBUTED",
    WAITING: "WAITING",
    CLAIM: "CLAIM",
    CLAIMED: "CLAIMED",
    STAKED: "STAKED",
    CLAIM_LIST: "CLAIM_LIST",
}

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56, 128],
});

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
    1: 'https://mainnet.infura.io/v3/3f6f55ba1ee540328662f8496ddbc228',
    4: 'https://rinkeby.infura.io/v3/8f6d3d5d7a1442a38d9e8050c31c1884',
};

const walletChange = new WalletConnectConnector({
    rpc: {1: RPC_URLS[1]},
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

const ETH_OPTIONS = [
    {id: 0, title: 'BSC',chainId: 56, logo: <Binance className="icon"/>, icon: Binnace_logo},
    {id: 1, title: 'HECO',chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo}
]
const BINANCE_OPTIONS = [
    {id: 0, title: 'ETH', chainId: 1 ,logo: <ETH className="icon"/>, icon: ETH_logo},
    {id: 1, title: 'HECO',chainId: 128, logo: <Huobi className="icon"/>, icon: Huobi_logo}
]
const HECO_OPTIONS = [
    {id: 0, title: 'ETH', chainId: 1 ,logo: <ETH className="icon"/>, icon: ETH_logo},
    {id: 1, title: 'BSC',chainId: 56, logo: <Binance className="icon"/>, icon: Binnace_logo},
]

export const Bridge = () => {

    const {
        connector,
        library,
        activate,
        deactivate,
        account,
        active,
        chainId
    } = useWeb3React();


    const balance = useBalance(MATTER_ADDRESS(chainId))

    const [modalType, setModalType] = useState(MODE_TYPE.INIT)

    const [claimData, setClaimData] = useState()
    const [claimList, setClaimList] = useState([])

    const [amount, setAmount] = useState()
    const [inputAccount, setInputAccount] = useState()

    const [stake, setStake] = useState(0)
    const [claim, setClaim] = useState(0)
    const [loading, setLoading] = useState(false)
    const [inputError, setInputError] = useState()

    const [claimingList, setClaimingList] = useState([])
    const [toChain, setToChain] = useState(CHAIN[0])
    const [toChainList, setToChainList] = useState(CHAIN)


    const loadChainInfo = (id) => {
        switch (id) {
            case 1:
                return CHAIN[0]
            case 3:
                return CHAIN[3]
            case 4:
                return CHAIN[4]
            case 56:
                return CHAIN[1]
            case 128:
                return CHAIN[2]
            default:
        }
    }

    const fetchData = () => {
        try {
            fetch(`https://api.antimatter.finance/web/getClaimList?status=0&to=${account}`).then((res) => {
                setLoading(false)
                res.json().then((result) => {
                    setTimeout(() => {
                        fetchData()
                    }, 2000)
                    console.log('result--->', result.data)
                    if (result.data) {
                        setClaimList(result.data)
                    }
                }).catch((e) => {
                    console.log('load err', e)
                })
            })
        } catch (e) {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (account && chainId) {
            //setLoading(true)
            //fetchData()
        }
    }, [account, chainId])

    useEffect(() => {
        if (active) {
            let curChainList = CHAIN
            switch (chainId) {
                case 1:
                    curChainList = ETH_OPTIONS
                    break;
                case 56:
                    curChainList = BINANCE_OPTIONS
                    break
                case 128:
                    curChainList = HECO_OPTIONS
                    break
                default:
                    curChainList = CHAIN
            }
            setToChainList(curChainList)
            setToChain(curChainList[0])
        }
    }, [active, chainId])

    useEffect(() => {
        const claimIdListData = window.localStorage.getItem('CLAIMING_ID_LIST')
        if(claimIdListData){
            try {
                let claimIds= JSON.parse(claimIdListData)
                const ids = claimList.map(item =>{return item.id})
                console.log('ids',ids)
                claimIds = claimIds.filter(item =>{
                    return ids.indexOf(item) !== -1
                })
                console.log('claiming ids',ids)
                window.localStorage.setItem('CLAIMING_ID_LIST', JSON.stringify(claimIds))
                setClaimingList(claimIds)
            }catch (e) {

            }
        }
    }, [claimList])

    useEffect(() => {
        if (claimData) {
            if(claimData.chainId === chainId){
                setModalType(MODE_TYPE.CLAIM)
            }else {
                setModalType(MODE_TYPE.SWITCH_CHAIN)
            }
        }
    }, [claimData, chainId])


    useEffect(() => {
        if (account) {
            setInputAccount(account)
        }
    }, [account])


    const onStake = async (func) => {
        console.log('func-------->', toChain.chainId)
        const contract = getContract(library, chainId === 1 ? MainMatter : SubMatter, MATTER_ADDRESS(chainId));
        setStake(1)
        try {
            await contract.methods[func](numToWei(amount), toChain.chainId, inputAccount)
                .send({from: account})
                .on('transactionHash', hash => {

                })
                .on('receipt', (_, receipt) => {
                    setModalType(MODE_TYPE.STAKED)
                })
                .on('error', (err, receipt) => {
                    setStake(0)
                });

        } catch (e) {
            setStake(0)
            console.log('stake  error--->', e)
        }
    }


    const onClaim = async (func) => {
        console.log('claim info', claimData.id, func, chainId, MATTER_ADDRESS(chainId))

        setClaim(1)
        const contract = getContract(library, chainId === 1 ? MainMatter : SubMatter, MATTER_ADDRESS(chainId));
        setClaim(1)
        try {
            const res = await fetch(`https://api.antimatter.finance/web/getSignDataSyn?stakeBurnId=${claimData.id}`)
            const jsonData = await res.json()
            const data = jsonData.data
            console.log('claim data', data.authorizer, data.to, data.volume, data.fromChainId, data.hash, data.signV, data.signR, data.signS)

            await contract.methods[func](data.authorizer, data.to, data.volume.toString(), data.fromChainId, data.hash, data.signV, data.signR, data.signS)
                .send({from: account})
                .on('transactionHash', hash => {

                })
                .on('receipt', (_, receipt) => {
                    window.localStorage.setItem('CLAIMING_ID_LIST', JSON.stringify(claimingList.concat(claimData.id)))
                    setClaimingList(claimingList.concat(claimData.id))
                    setClaim(0)
                    setModalType(MODE_TYPE.CLAIMED)
                })
                .on('error', (err, receipt) => {
                    setStake(0)
                });
        } catch (e) {
            setClaim(0)
            console.log('claim error', e)
        }
    }


    return (

        <>
            {loading ? (
                <div className="loader-container">
                    <div className="stage">
                        <div>
                            <svg width="162" height="31" viewBox="0 0 162 31" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.5">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M43.3417 1.35291C42.5154 1.35291 41.8457 2.02267 41.8457 2.84887V25.2884C41.8457 26.1146 42.5154 26.7843 43.3417 26.7843H91.2126C92.0391 26.7843 92.7085 26.1146 92.7085 25.2884V2.84887C92.7085 2.02267 92.0391 1.35291 91.2126 1.35291H43.3417ZM51.1498 17.6463L48.8666 23.047H46.4234L54.7816 4.14468L63.1397 23.047H60.6966L58.4013 17.6463H51.1498ZM57.5394 15.589H52.0308L54.7816 9.10814L57.5394 15.589ZM72.7875 23.047V15.8461C72.7875 15.1946 72.6933 14.6545 72.5048 14.2259C72.3163 13.7801 72.0335 13.4458 71.6562 13.2229C71.279 13 70.8161 12.8886 70.2675 12.8886C69.6674 12.8886 69.1359 13.0172 68.673 13.2743C68.2272 13.5144 67.8757 13.8573 67.6186 14.303C67.3785 14.7488 67.2586 15.2631 67.2586 15.8461V23.047H65.2012V11.217H67.2586V13.0686C67.6529 12.3486 68.1415 11.817 68.7245 11.4742C69.3245 11.1313 70.0103 10.9598 70.7819 10.9598C71.6219 10.9598 72.3417 11.1484 72.9423 11.5255C73.5422 11.9028 74.0052 12.4343 74.3306 13.1201C74.6739 13.8058 74.8452 14.6288 74.8452 15.589V23.047H72.7875ZM76.9126 11.217V13.1458H78.8417V23.047H80.8986V13.1458H82.8277V11.217H80.8986V7.1022H78.8417V11.217H76.9126ZM85.3027 7.33363C85.0282 7.04221 84.8914 6.70786 84.8914 6.33066C84.8914 5.93632 85.0282 5.60205 85.3027 5.32769C85.5937 5.0534 85.9281 4.91622 86.3058 4.91622C86.7 4.91622 87.0343 5.0534 87.3081 5.32769C87.5826 5.60205 87.7202 5.93632 87.7202 6.33066C87.7202 6.70786 87.5826 7.04221 87.3081 7.33363C87.0343 7.60799 86.7 7.74509 86.3058 7.74509C85.9281 7.74509 85.5937 7.60799 85.3027 7.33363ZM85.2766 23.047V11.217H87.3343V23.047H85.2766Z"
                                          fill="white"/>
                                    <path
                                        d="M113.398 15.0755C113.398 14.0982 113.244 13.2666 112.935 12.5809C112.644 11.8779 112.215 11.3464 111.65 10.9864C111.083 10.6263 110.398 10.4463 109.592 10.4463C108.803 10.4463 108.1 10.6349 107.483 11.0121C106.866 11.3721 106.352 11.9208 105.94 12.658C105.769 12.1779 105.512 11.7751 105.169 11.4493C104.843 11.1235 104.457 10.875 104.011 10.7035C103.565 10.5321 103.069 10.4463 102.52 10.4463C102.039 10.4463 101.594 10.5235 101.182 10.6778C100.771 10.815 100.402 11.0293 100.077 11.3207C99.7678 11.6122 99.4933 11.9808 99.254 12.4266V10.7035H97.1963V22.5335H99.254V15.3326C99.254 14.7154 99.3654 14.1839 99.5883 13.7382C99.8112 13.2924 100.128 12.9581 100.54 12.7352C100.951 12.4952 101.44 12.3751 102.005 12.3751C102.52 12.3751 102.94 12.4866 103.265 12.7095C103.609 12.9152 103.857 13.2324 104.011 13.661C104.183 14.0896 104.268 14.6468 104.268 15.3326V22.5335H106.326V15.3326C106.326 14.7154 106.438 14.1839 106.66 13.7382C106.883 13.2924 107.201 12.9581 107.612 12.7352C108.023 12.4952 108.512 12.3751 109.078 12.3751C109.592 12.3751 110.012 12.4866 110.338 12.7095C110.681 12.9152 110.929 13.2324 111.083 13.661C111.255 14.0896 111.341 14.6468 111.341 15.3326V22.5335H113.398V15.0755Z"
                                        fill="white"/>
                                    <path
                                        d="M118.188 18.8817C118.188 18.453 118.291 18.0844 118.497 17.7758C118.703 17.4672 119.012 17.2271 119.423 17.0557C119.852 16.8842 120.4 16.7985 121.069 16.7985C121.789 16.7985 122.466 16.8929 123.1 17.0814C123.734 17.2529 124.352 17.5443 124.952 17.9558V16.7471C124.832 16.5928 124.601 16.3956 124.258 16.1556C123.915 15.8984 123.452 15.6755 122.869 15.4869C122.304 15.2812 121.591 15.1783 120.734 15.1783C119.775 15.1783 118.943 15.3412 118.24 15.667C117.554 15.9755 117.023 16.4127 116.645 16.9786C116.285 17.5443 116.105 18.213 116.105 18.9845C116.105 19.7903 116.294 20.4761 116.671 21.0419C117.048 21.6077 117.546 22.0449 118.163 22.3535C118.797 22.6449 119.474 22.7907 120.194 22.7907C120.846 22.7907 121.497 22.6706 122.149 22.4306C122.817 22.1906 123.375 21.822 123.82 21.3248C124.283 20.8275 124.515 20.2018 124.515 19.4474L124.103 17.9043C124.103 18.5216 123.949 19.0702 123.64 19.5503C123.349 20.0132 122.946 20.3732 122.431 20.6304C121.935 20.8876 121.369 21.0162 120.734 21.0162C120.238 21.0162 119.792 20.939 119.397 20.7847C119.02 20.6132 118.72 20.3647 118.497 20.0389C118.291 19.7131 118.188 19.3274 118.188 18.8817ZM117.88 13.4295C118.068 13.2924 118.326 13.1295 118.651 12.9409C118.977 12.7523 119.371 12.5894 119.834 12.4523C120.315 12.3151 120.846 12.2465 121.429 12.2465C121.789 12.2465 122.131 12.2809 122.458 12.3494C122.783 12.418 123.066 12.5294 123.306 12.6837C123.563 12.838 123.761 13.0523 123.897 13.3267C124.035 13.5839 124.103 13.9182 124.103 14.3297V22.5335H126.161V14.0468C126.161 13.2752 125.963 12.6237 125.569 12.0922C125.192 11.5607 124.652 11.1578 123.949 10.8835C123.263 10.5921 122.458 10.4463 121.532 10.4463C120.434 10.4463 119.491 10.6092 118.703 10.9349C117.932 11.2607 117.323 11.5864 116.877 11.9122L117.88 13.4295Z"
                                        fill="white"/>
                                    <path
                                        d="M127.844 10.7039V12.6327H133.759V10.7039H127.844ZM129.773 6.58911V22.5339H131.83V6.58911H129.773Z"
                                        fill="white"/>
                                    <path
                                        d="M134.022 10.7039V12.6327H139.938V10.7039H134.022ZM135.952 6.58911V22.5339H138.008V6.58911H135.952Z"
                                        fill="white"/>
                                    <path
                                        d="M146.579 22.7907C147.848 22.7907 148.945 22.5421 149.87 22.0449C150.813 21.5305 151.594 20.7762 152.211 19.7817L150.539 18.7274C150.11 19.4474 149.587 19.9875 148.97 20.3475C148.353 20.6904 147.642 20.8619 146.836 20.8619C146.03 20.8619 145.344 20.6904 144.779 20.3475C144.212 20.0046 143.784 19.5074 143.493 18.8559C143.201 18.2044 143.055 17.4158 143.055 16.4899C143.055 15.8213 143.141 15.2212 143.313 14.6897C143.484 14.1582 143.733 13.7124 144.058 13.3524C144.384 12.9923 144.779 12.7181 145.242 12.5294C145.721 12.3409 146.253 12.2465 146.836 12.2465C147.504 12.2465 148.088 12.3922 148.584 12.6837C149.082 12.9752 149.468 13.3781 149.742 13.8925C150.033 14.4068 150.179 15.0154 150.179 15.7184C150.179 15.8384 150.154 15.9927 150.102 16.1813C150.05 16.3527 149.999 16.4813 149.948 16.567L150.771 15.3841H142.284V17.1329H152.391C152.391 17.0985 152.391 17.0214 152.391 16.9014C152.408 16.7642 152.416 16.6356 152.416 16.5156C152.416 15.264 152.193 14.1839 151.748 13.2752C151.302 12.3666 150.659 11.6722 149.819 11.1921C148.996 10.6949 148.002 10.4463 146.836 10.4463C145.961 10.4463 145.164 10.6006 144.444 10.9092C143.724 11.2007 143.107 11.6208 142.592 12.1694C142.078 12.7009 141.675 13.3438 141.384 14.0982C141.11 14.8526 140.972 15.6926 140.972 16.6185C140.972 17.8358 141.204 18.9073 141.666 19.8332C142.147 20.759 142.807 21.4876 143.647 22.0191C144.504 22.5335 145.482 22.7907 146.579 22.7907Z"
                                        fill="white"/>
                                    <path
                                        d="M157.294 10.7035H155.236V22.5335H157.294V10.7035ZM160.868 12.9666L162 11.2693C161.691 10.9435 161.348 10.7293 160.971 10.6263C160.611 10.5064 160.217 10.4463 159.788 10.4463C159.239 10.4463 158.699 10.6607 158.168 11.0893C157.636 11.5178 157.199 12.1008 156.856 12.838C156.531 13.5581 156.368 14.3897 156.368 15.3326H157.294C157.294 14.7669 157.345 14.2611 157.448 13.8153C157.568 13.3696 157.774 13.0181 158.065 12.7609C158.356 12.5037 158.76 12.3751 159.273 12.3751C159.617 12.3751 159.9 12.4266 160.122 12.5294C160.345 12.6151 160.594 12.7609 160.868 12.9666Z"
                                        fill="white"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M21.8255 24.9795C24.3133 24.9795 26.3302 22.9626 26.3302 20.4747C26.3302 17.9868 24.3133 15.97 21.8255 15.97C19.3375 15.97 17.3207 17.9868 17.3207 20.4747C17.3207 22.9626 19.3375 24.9795 21.8255 24.9795ZM27.8262 20.4747C27.8262 23.7888 25.1396 26.4755 21.8255 26.4755C18.5113 26.4755 15.8247 23.7888 15.8247 20.4747C15.8247 17.1606 18.5113 14.474 21.8255 14.474C25.1396 14.474 27.8262 17.1606 27.8262 20.4747Z"
                                          fill="white"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M18.1312 23.5782C18.4303 23.9453 18.3751 24.4852 18.0079 24.7843C14.8919 27.3225 11.6469 29.0937 8.77806 29.8675C5.94986 30.6304 3.24883 30.4749 1.53951 28.7656C-0.358165 26.8679 -0.346279 23.7545 0.734338 20.5512C0.885678 20.1027 1.37202 19.8617 1.82063 20.013C2.26924 20.1643 2.51022 20.6507 2.35888 21.0993C1.33323 24.1396 1.57707 26.3785 2.75184 27.5533C3.80686 28.6083 5.71575 28.9178 8.33159 28.2122C10.9069 27.5175 13.94 25.8866 16.9252 23.455C17.2923 23.156 17.8322 23.2111 18.1312 23.5782Z"
                                          fill="white"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M12.1501 6.79361C11.8624 6.41752 11.934 5.8795 12.3101 5.59183C15.2998 3.30479 18.3713 1.73021 21.0821 1.07654C23.7606 0.430686 26.3012 0.644153 27.9342 2.27718C29.8319 4.17485 29.82 7.28832 28.7394 10.4916C28.5881 10.9402 28.1017 11.1812 27.6531 11.0298C27.2045 10.8785 26.9635 10.3922 27.1149 9.94359C28.1405 6.90319 27.8967 4.66425 26.7219 3.48951C25.7147 2.48234 23.9316 2.15309 21.484 2.74326C19.0688 3.32563 16.2118 4.76583 13.3518 6.9536C12.9758 7.24128 12.4377 7.16962 12.1501 6.79361Z"
                                          fill="white"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M14.9687 10.1883C14.9687 13.5024 12.2821 16.189 8.96801 16.189C5.65392 16.189 2.96729 13.5024 2.96729 10.1883C2.96729 6.87422 5.65392 4.18762 8.96801 4.18762C12.2821 4.18762 14.9687 6.87422 14.9687 10.1883ZM8.36775 7.18755H9.56789V9.58761H11.9673V10.7877H9.56789V13.1882H8.36775V10.7877H5.9665V9.58761H8.36775V7.18755Z"
                                          fill="white"/>
                                    <path d="M23.9697 20.9896V19.7894H19.6835V20.9896H23.9697Z" fill="white"/>
                                </g>
                            </svg>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="page">
                    <header>
                        <img src={LogoLineWhite} alt=""/>
                        {active && account && (
                            <div className="chain_info">
                                <div className="connected_chain">
                                    <img src={chainId === 56 ? Binance : chainId === 128 ? Huobi : ETH}/>
                                    <p>{chainId === 56 ? 'BSC' : chainId === 128 ? 'HEC0' : 'ETH'}</p>
                                </div>
                                <div className="wallet">
                                    <p className="wallet__balance">{balance ? formatAmount(balance, 18, 2) : '--'} MATTER</p>
                                    <p className="wallet__address" onClick={() => setModalType(MODE_TYPE.PROFILE)}>
                                        <div className="dot"/>
                                        <p>{formatAddress(account)}</p>
                                        <CopyToClipboard
                                            text={account}
                                            onCopy={() => {
                                                // alert('copy success!')
                                            }}>
                                            <Copy/>
                                        </CopyToClipboard>
                                    </p>
                                </div>
                            </div>
                        )}
                    </header>

                    {modalType === MODE_TYPE.WAITING && (
                        <div className="default_modal connecting">
                            <p className="default_modal__title">It takes a few minutes to populate your staking
                                transaction record on the other chain. Please wait patiently.</p>
                            <img className="investment__modal__loading" src={Circle} alt=""/>
                        </div>
                    )}

                    {modalType === MODE_TYPE.WALLETS && (
                        <div style={{paddingBottom: 40}} className="default_modal modal-wallets">
                            <Close className="close-btn" onClick={() => {
                                setModalType(MODE_TYPE.INIT)
                            }}/>
                            <p className="default_modal__title">Connected with MetaMask</p>
                            <button onClick={() => {
                                setModalType(MODE_TYPE.CONNECTING)
                                activate(injected)
                                    .then(() => {
                                        setModalType(MODE_TYPE.INIT)
                                        window &&
                                        window.localStorage.setItem(
                                            GALLERY_SELECT_WEB3_CONTEXT,
                                            'MetaMask'
                                        );
                                    })
                                    .catch(() => {
                                    })
                            }}>
                                <img src={metamask}/>
                                MetaMask
                            </button>
                            <button style={{marginTop: 16}} onClick={() => {
                                setModalType(MODE_TYPE.CONNECTING)
                                activate(walletChange)
                                    .then(() => {
                                        setModalType(MODE_TYPE.INIT)
                                        window &&
                                        window.localStorage.setItem(
                                            GALLERY_SELECT_WEB3_CONTEXT,
                                            'WalletConnect'
                                        );
                                    })
                                    .catch(() => {
                                    })
                            }}>
                                <img src={walletConnect}/>
                                WalletConnect
                            </button>
                        </div>
                    )}

                    {modalType === MODE_TYPE.PROFILE && (
                        <div className="default_modal modal_profile">

                            <p className="default_modal__title">Connected with MetaMask</p>
                            <div className="modal_profile__address">
                                <div className="dot"/>
                                <p>{account && formatAddress(account)}</p>
                            </div>

                            <div className="modal_profile__copy">
                                <Copy/>
                                <p>{'Copy Address'}</p>
                            </div>

                            <div className="btn_group">
                                <button onClick={() => {
                                    setModalType(MODE_TYPE.WALLETS)
                                }}>Change
                                </button>
                                <button onClick={() => {
                                    setModalType(MODE_TYPE.INIT)
                                }}>Close
                                </button>
                            </div>
                        </div>
                    )}

                    {modalType === MODE_TYPE.INIT && (
                        <div className="bridge">
                            <h5 className="bridge__title">Cross Chain Bridge</h5>
                            <div className="inputs">
                                <div className="bridge__dropdown_frame">
                                    <div className="dropdown">
                                        <span>From</span>
                                        <div/>
                                        <div className="default_drop">
                                            <img src={chainId && loadChainInfo(chainId).icon}/>
                                            <p>{chainId && loadChainInfo(chainId).title}</p>
                                        </div>
                                        {/*<DropDown disabled*/}
                                        {/*          index={0} onSelect={(e) => {*/}
                                        {/*    setFromChain(e)*/}
                                        {/*    setFromChainId(e.id)*/}
                                        {/*}}/>*/}
                                    </div>
                                    <img src={Exchange}/>
                                    <div className="dropdown">
                                        <span>To</span>
                                        <div/>
                                        <DropDown options={toChainList} index={toChain.id} onSelect={(e) => {
                                            setToChain(e)
                                        }}/>
                                    </div>
                                </div>

                                {active && (
                                    <div className="bridge__input_frame">
                                        <p>Destination Chain Wallet Address</p>
                                        <input value={inputAccount}
                                               onChange={(e) => {
                                                   const value = e.target.value
                                                   setInputAccount(value)
                                               }} placeholder='Enter address to swap'/>
                                        <p className="error">{!isAddress(inputAccount) ? 'Invalid address' : ''}</p>
                                        {inputAccount && (
                                            <button onClick={() => {
                                                setInputError(null)
                                                setInputAccount('')
                                            }} className="max">Clear
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="bridge__input_frame">
                                    <p>Asset</p>
                                    <input disabled style={{paddingLeft: 56}} value={'MATTER'}/>
                                    <img src={Matter}/>
                                </div>

                                <div className="bridge__input_frame">
                                    <p>Amount <span>{`Your balance: ${formatAmount(balance, 18, 6)} MATTER`}</span></p>
                                    <input value={amount}
                                           onChange={(e) => {
                                               const value = e.target.value
                                               setAmount(value)
                                               setInputError(null)
                                               if (!balance || new BigNumber(numToWei(value)).isGreaterThan(balance)) {
                                                   console.log('balance---->', numToWei(value))
                                                   setInputError('You do not have enough MATTER')
                                               }
                                           }} placeholder='Enter amount to swap'/>
                                    <p className="error">{inputError}</p>
                                    <button onClick={() => {
                                        setInputError(null)
                                        setAmount(formatAmount(balance, 18, 18))
                                    }} className="max">Max
                                    </button>
                                </div>
                            </div>

                            {!active ? (
                                <button style={{marginTop: 18}} onClick={() => {
                                    setModalType(MODE_TYPE.WALLETS)
                                }}>Connect Wallet</button>
                            ) : (
                                <button style={{marginTop: 18}}
                                        disabled={!amount || inputError || !inputAccount || !isAddress(inputAccount) || stake !== 0}
                                        onClick={() => {
                                            if (chainId === 1) {
                                                onStake('stake')
                                            } else {
                                                onStake('burn')
                                            }
                                        }}>{stake === 1 ? 'Staking' : `Stake tokens in ${loadChainInfo(chainId).title} network (${toChain.title})`}</button>
                            )}

                            <a className="bridge__claim_text" onClick={()=>{
                                setModalType(MODE_TYPE.CLAIM_LIST)
                            }}>Claim List</a>
                        </div>
                    )}

                    {modalType === MODE_TYPE.SWITCH_CHAIN && (
                        <div className="default_modal modal-switch">
                            <p className="default_modal__title" style={{width: 332}}>Please switch your wallet network
                                to {claimData && loadChainInfo(claimData.chainId).title} to
                                complete token
                                swap</p>
                            <div className="extra">
                                <p>From:</p>
                                <img src={claimData && loadChainInfo(claimData.fromChainId).icon}/>
                                <h5>{claimData && loadChainInfo(claimData.fromChainId).title}</h5>
                                <img className="arrow" src={ArrowLeft}/>
                                <p>To:</p>
                                <img src={claimData && loadChainInfo(claimData.chainId).icon}/>
                                <h5>{claimData && loadChainInfo(claimData.chainId).title}</h5>
                            </div>
                            <div className="chain_tip">
                                <p>Destination Chain Address:</p>
                                <p>{claimData && formatAddress(claimData.toAddress, 10, -5)}</p>
                            </div>
                            <div className="line"/>
                            <p>To learn more about how to add network to wallet, <a target="_blank" href="https://antimatterdefi.medium.com/announcing-antimatter-defi-cross-chain-bridge-innovation-7d23515d0844">click here</a></p>
                            <button disabled onClick={() => {
                                //setModalType(MODE_TYPE.CLAIM)
                            }} className="switch_btn">{`Switch wallet network  ${toChain.title} and refresh your page`}</button>
                        </div>
                    )}

                    {modalType === MODE_TYPE.CLAIM && (
                        <div className="default_modal claim_modal">
                            <Close className="close-btn" onClick={() => {
                                setModalType(MODE_TYPE.INIT)
                            }}/>
                            <p className="default_modal__title" style={{marginBottom: 20}}>Claim tokens</p>
                            <p className="claim__amount">{formatAmount(claimData.volume)} MATTER</p>
                            <div className="extra">
                                <p>From:</p>
                                <img src={claimData && loadChainInfo(claimData.fromChainId).icon}/>
                                <h5>{claimData && loadChainInfo(claimData.fromChainId).title}</h5>
                                <img className="arrow" src={ArrowLeft}/>
                                <p>To:</p>
                                <img src={claimData && loadChainInfo(claimData.chainId).icon}/>
                                <h5>{claimData && loadChainInfo(claimData.chainId).title}</h5>
                            </div>
                            <div className="chain_tip">
                                <p>Destination Chain Address:</p>
                                <p>{claimData && formatAddress(claimData.toAddress, 10, -5)}</p>
                            </div>
                            <button disabled={claim !== 0} onClick={() => {
                                onClaim(chainId === 1 ? 'redeem' : 'mint')
                            }}
                                    className="switch_btn">{claim === 1 ? 'Claiming' : `Claim Tokens on ${claimData && loadChainInfo(claimData.chainId).title}`}
                            </button>
                        </div>
                    )}

                    {modalType === MODE_TYPE.CLAIM_LIST && (
                        <div className="default_modal claim_modal">
                            <Close className="close-btn" onClick={() => {
                                setModalType(MODE_TYPE.INIT)
                            }}/>
                            <p className="default_modal__title" style={{marginBottom: 24}}>Claim List</p>

                            {claimList.map(item =>{
                                return (
                                    <div className={`extra ${claimingList.indexOf(item.id) !== -1? 'claim_disabled': ''}`} onClick={()=>{
                                        setClaimData(item)
                                        //setModalType(MODE_TYPE.CLAIM)
                                    }}>
                                        <p>From:</p>
                                        <img src={loadChainInfo(item.fromChainId).icon}/>
                                        <h5>{loadChainInfo(item.fromChainId).title}</h5>
                                        <h5 className="amount">{formatAmount(item.volume)}</h5>
                                        <p>To:</p>
                                        <img src={loadChainInfo(item.chainId).icon}/>
                                        <h5>{loadChainInfo(item.chainId).title}</h5>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {modalType === MODE_TYPE.CLAIMED && (
                        <div className="default_modal claimed_mode">
                            <img src={Success}/>
                            <p style={{marginTop: 19, fontSize: 18}}>You have successfully claimed tokens
                                to {claimData && loadChainInfo(claimData.chainId).title}</p>
                            <a>View on Etherscan</a>
                            <div className="add_token">
                                <p>Add MATTER to Metamask</p>
                                <img src={metamask}/>
                            </div>
                            <button style={{marginTop: 32}} onClick={() => {
                                window.location.reload()
                            }}>Close
                            </button>
                        </div>
                    )}

                    {modalType === MODE_TYPE.STAKED && (
                        <div className="default_modal claimed_mode">
                            <img src={Success}/>
                            <p style={{marginTop: 19, fontSize: 18}}>You have successfully staked your tokens, please visit claim list to proceed.</p>
                            <button style={{marginTop: 32}} onClick={() => {
                                window.location.reload()
                            }}>Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>

    )
}