import React, {useEffect, useRef} from 'react'
import '../assets/css/animator.css'
import '../styles.css'
import LogoLineWhite from '../assets/image/logo-line-white.svg'
import LogoLineBlack from '../assets/image/logo-line-black.svg'
import MobileBlock from '../assets/image/mobile-block.svg'
import Bottom1 from '../assets/image/bottom1.svg'
import Bottom2 from '../assets/image/bottom2.svg'
import Bottom3 from '../assets/image/bottom3.svg'
import BlockIcon1 from '../assets/image/block-icon-1.svg'
import BlockIcon2 from '../assets/image/block-icon-2.svg'
import BlockIcon3 from '../assets/image/block-icon-3.svg'
import BlockIcon4 from '../assets/image/block-icon-4.svg'
import BlockIcon5 from '../assets/image/block-icon-5.svg'
import BlockIcon6 from '../assets/image/block-icon-6.svg'
import Comp from '../assets/image/comp.svg'
import Animation from '../assets/animation.gif'
import LeftLines from '../assets/image/left-lines.svg'
import RightLines from '../assets/image/right-lines.svg'


import MediaQuery from 'react-responsive';


export const Home = () => {

    return (
        <div className="home">
            <div className="home__frame">
                <header>
                    <img src={LogoLineWhite} alt=""/>
                    <a>App Coming Soon</a>
                </header>

                <div className="home__frame__page">
                    <div className="home__frame__page__content">
                        <div className="home__frame__page__content__title">A simple lightweight onchain DeFi derivative
                            protocol
                        </div>
                        <p className="home__frame__page__content__sub_title">Polarized token mechanism with tokenized
                            perpetual derivatives</p>
                        <div className="home__frame__page__content__calc">Value(long)+Value(short)=C</div>

                        <a>App Coming Soon</a>
                    </div>
                    <div className="home__frame__page__bg">
                        {/*<video*/}
                        {/*    muted*/}
                        {/*    src={require("../assets/animation.mp4")}*/}
                        {/*    autoPlay='autoPlay'*/}
                        {/*    loop='loop'*/}
                        {/*/>*/}
                        <img className="circle" src={Animation}/>
                    </div>
                </div>
            </div>

            <MediaQuery query='(min-device-width:1200px)'>
                <div className="home__frame" style={{
                    backgroundColor: '#EAEAEA',
                    height: 'fit-content',
                    backgroundImage: "url(" + require("../assets/image/block1.svg") + ") "
                }}>
                    <div className="home__frame_blocks">
                        <h2>Protocol Features</h2>
                        <div className="home__frame__block block1">
                            <img src={BlockIcon1}/>
                            <h5>Innovative and </h5>
                            <h5>elegant DeFi </h5>
                            <h5>mechanism</h5>

                            <p style={{marginTop: 5}}>Execute put and call</p>
                            <p>strategies fully</p>
                            <p>on-chain</p>
                        </div>

                        <div className="home__frame__block block2">
                            <img src={BlockIcon2}/>
                            <h5>Auto rebalancing </h5>
                            <h5>polarized token</h5>
                            <h5>mechanism</h5>

                            <p style={{marginTop: 5}}>Funding, fee distribution</p>
                            <p>and rebalancing happens</p>
                            <p>automatically</p>
                        </div>

                        <div className="home__frame__block block3">
                            <img src={BlockIcon3}/>
                            <h5>Cross chain</h5>
                            <h5>compatible</h5>

                            <p style={{marginTop: 5}}>Polkadot/Binance</p>
                            <p>Smart Chain and more</p>
                        </div>

                        <div className="home__frame__block block4">
                            <img src={BlockIcon4}/>
                            <h5>Secondary market</h5>
                            <h5>opportunities</h5>
                            <h5>across products</h5>

                            <p style={{marginTop: 5}}>Market making, arbitrage</p>
                            <p>and passive yield</p>
                            <p>opportunities</p>
                        </div>

                        <div className="home__frame__block block5">
                            <img src={BlockIcon5}/>
                            <h5>Self-sustainable and</h5>
                            <h5>community governed</h5>

                            <p style={{marginTop: 5}}>Fees from products and</p>
                            <p>protocol usage used to</p>
                            <p>buyback MATTER.</p>
                        </div>

                        <div className="home__frame__block block6">
                            <img src={BlockIcon6}/>
                            <h5>Simple and </h5>
                            <h5>intuitive to use</h5>

                            <p style={{marginTop: 5}}>All Antimatter products are</p>
                            <p>perpetual options without expiry</p>
                            <p>dates or added complexity.</p>
                            <p>Built for mass adoption</p>
                            <p></p>
                        </div>
                    </div>
                </div>

                <div className="home__frame" style={{backgroundColor: '#EAEAEA', height: 'fit-content'}}>
                    <h2>Antimatter Contributors</h2>
                    <div className="home__frame__teams" style={{backgroundColor: '#EAEAEA', height: 'fit-content'}}>
                        <div className="bg">
                            <img src={LeftLines}/>
                            <img src={RightLines} style={{marginLeft: -10}}/>
                        </div>
                        <div className="home__frame__teams__team team1">
                            <img src={Comp}/>
                            <h3>Jack Lu</h3>
                            <p style={{marginTop: 20}}>Creator of Bounce.Finance</p>
                        </div>

                        <div className="home__frame__teams__team team2">
                            <img src={Comp}/>
                            <h3>Robert Hu</h3>
                            <p style={{marginTop: 20}}>Creator of Helmet.Insure</p>
                            <p>and UU.Finance</p>

                        </div>
                    </div>
                </div>
            </MediaQuery>
            {/*<MediaQuery query='(min-device-width:1224px)'>*/}
            {/*    <div className="home__frame" style={{height: 'fit-content'}}>*/}
            {/*        <img style={{width: '100%'}} src={Block1}/>*/}
            {/*        <img style={{width: '100%'}} src={Block2}/>*/}
            {/*    </div>*/}
            {/*</MediaQuery>*/}

            <MediaQuery query='(max-device-width:750px)'>
                <div className="home__frame" style={{height: 'fit-content'}}>
                    <img style={{width: '100%'}} src={MobileBlock}/>
                </div>
            </MediaQuery>

            <div className="home__frame" style={{height: 'fit-content'}}>
                <div className="home__frame__bottom">
                    <p>Backed by</p>

                    <div className="home__frame__bottom__backed">
                        <img src={Bottom1}/>
                        <div className="home__frame__bottom__divider"/>
                        <img src={Bottom2}/>
                        <div className="home__frame__bottom__divider"/>
                        <img src={Bottom3}/>
                    </div>

                    <div className="home__frame__bottom__footer">
                        <p>© Antimatter Finance. All rights reserved.</p>
                        <img src={LogoLineBlack}/>
                        <ul>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://github.com/antimatter-finance"
                                >
                                    <svg width="22" height="23" viewBox="0 0 22 23" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M21.8475 11.901C21.8475 16.5671 19.0439 20.5643 15.0635 22.2306C14.053 22.5107 13.1088 21.9727 13.1081 21.0357C13.1081 20.9276 13.1093 20.7383 13.1109 20.4853C13.1142 19.9756 13.1191 19.2071 13.1191 18.323C13.1191 17.4013 12.8174 16.7989 12.4783 16.4928C14.5789 16.2472 16.7873 15.4107 16.7873 11.6143C16.7873 10.5354 16.4216 9.65304 15.8167 8.96056C15.9152 8.71172 16.2387 7.70656 15.7245 6.3445C15.7245 6.3445 14.9336 6.0793 13.1316 7.35786C12.3767 7.13849 11.5686 7.0288 10.7668 7.02553C9.96349 7.0288 9.15701 7.13849 8.40367 7.35786C6.60004 6.0793 5.80763 6.3445 5.80763 6.3445C5.29654 7.70656 5.61851 8.71172 5.71697 8.96056C5.11368 9.65304 4.74483 10.5354 4.74483 11.6143C4.74483 15.4008 6.94857 16.2488 9.04448 16.4993C8.77565 16.7465 8.53027 17.1836 8.44587 17.8221C7.90822 18.0742 6.54221 18.5113 5.69978 17.0003C5.69978 17.0003 5.19964 16.0524 4.2525 15.982C4.2525 15.982 3.33193 15.9689 4.18842 16.5828C4.18842 16.5828 4.80578 16.8873 5.23559 18.03C5.23559 18.03 5.78887 19.7931 8.41617 19.1956C8.41799 19.6756 8.42193 20.14 8.4249 20.491C8.42704 20.7434 8.42868 20.9371 8.42868 21.0357C8.41705 21.8463 7.75058 22.4937 6.77824 22.2282C2.80095 20.5605 0 16.5649 0 11.901C0 5.73816 4.89074 0.742188 10.9238 0.742188C16.9568 0.742188 21.8475 5.73816 21.8475 11.901Z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href=" https://medium.com/@antimatterdefi"
                                >
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M22.042 3.38473C22.042 1.92627 20.8579 0.742188 19.3994 0.742188H3.12204C1.66358 0.742188 0.479492 1.92627 0.479492 3.38473V19.6621C0.479492 21.1206 1.66358 22.3047 3.12204 22.3047H19.3994C20.8579 22.3047 22.042 21.1206 22.042 19.6621V3.38473ZM12.4208 11.5235C12.4208 14.3635 10.1341 16.6658 7.31358 16.6658C4.49302 16.6658 2.20618 14.3635 2.20618 11.5235C2.20618 8.68351 4.49281 6.38108 7.31358 6.38108C10.1343 6.38108 12.4208 8.68351 12.4208 11.5235ZM18.0236 11.5235C18.0236 14.1968 16.8803 16.3648 15.4699 16.3648C14.0595 16.3648 12.9162 14.1968 12.9162 11.5235C12.9162 8.85028 14.0594 6.68232 15.4697 6.68232C16.8801 6.68232 18.0234 8.84956 18.0234 11.5235H18.0236ZM20.3153 11.5235C20.3153 13.9181 19.9132 15.8605 19.4172 15.8605C18.9211 15.8605 18.5192 13.9186 18.5192 11.5235C18.5192 9.1284 18.9212 7.18655 19.4172 7.18655C19.9131 7.18655 20.3153 9.12823 20.3153 11.5235Z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href=" https://twitter.com/antimatterdefi"
                                >
                                    <svg width="23" height="18" viewBox="0 0 23 18" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M19.9804 2.81652C20.8942 2.28793 21.5953 1.44976 21.9244 0.451303C21.0688 0.941967 20.1234 1.29681 19.1147 1.48892C18.3098 0.656868 17.1593 0.138062 15.8861 0.138062C13.4434 0.138062 11.464 2.053 11.464 4.41454C11.464 4.74981 11.5007 5.07651 11.5766 5.38853C7.90124 5.20988 4.64225 3.50908 2.45904 0.919942C2.07809 1.55377 1.8604 2.28793 1.8604 3.07103C1.8604 4.55403 2.64129 5.86329 3.82845 6.63171C3.10325 6.60968 2.42107 6.41513 1.8237 6.09699V6.14961C1.8237 8.22239 3.34751 9.95133 5.37378 10.3429C5.00169 10.4432 4.61188 10.4934 4.20687 10.4934C3.92211 10.4934 3.64367 10.4677 3.37536 10.4175C3.9373 12.1159 5.57122 13.3542 7.50763 13.3872C5.99268 14.5349 4.08537 15.2177 2.01354 15.2177C1.65663 15.2177 1.30352 15.1994 0.958008 15.159C2.91593 16.3716 5.24089 17.08 7.73924 17.08C15.8772 17.08 20.3246 10.5631 20.3246 4.91132C20.3246 4.72534 20.3221 4.54057 20.3133 4.35826C21.1777 3.75502 21.9295 3.00129 22.5205 2.14354C21.727 2.4837 20.8739 2.71374 19.9804 2.81652Z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://t.me/antimatterchat"
                                >
                                    <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                              d="M16.9544 19.7557C17.2436 19.9726 17.6165 20.0268 17.9489 19.8937C18.2813 19.7595 18.5257 19.4589 18.5994 19.0946C19.3801 15.2095 21.2739 5.37606 21.9846 1.84203C22.0385 1.57566 21.9487 1.29884 21.751 1.12095C21.5534 0.943058 21.2793 0.891689 21.035 0.987769C17.2679 2.46417 5.66664 7.07316 0.924799 8.93102C0.62383 9.04898 0.427975 9.3553 0.437857 9.6911C0.448638 10.0279 0.662462 10.3199 0.970619 10.4179C3.09717 11.0914 5.88855 12.0284 5.88855 12.0284C5.88855 12.0284 7.19306 16.1998 7.87316 18.3212C7.95851 18.5875 8.15526 18.7968 8.4149 18.8691C8.67365 18.9405 8.95036 18.8653 9.14352 18.6722C10.236 17.5801 11.925 15.8916 11.925 15.8916C11.925 15.8916 15.1342 18.383 16.9544 19.7557ZM7.06278 11.5014L8.57123 16.7696L8.90634 13.4335C8.90634 13.4335 14.7344 7.86748 18.0567 4.69494C18.1537 4.60171 18.1672 4.4457 18.0864 4.3363C18.0064 4.2269 17.8591 4.20122 17.7486 4.27542C13.8979 6.87909 7.06278 11.5014 7.06278 11.5014Z"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

// export const Home = () => {
//     return (<>
//         <div className='wrap'>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//             <div className='c'/>
//         </div>
//
//         <div className="CardWrap">
//             <div className="Card animate__animated animate__fadeInUp">
//                 <div className="LogoWrap">
//                     <img src={LogoLineWhite} alt=""/>
//                 </div>
//                 <div className="Title">
//                     Antimatter is an innovative lightweight on-chain and cross chain DeFi derivative protocol
//                 </div>
//                 <div className="SocialMediaLinks">
//                     <a hre="">
//                         <i className="fa fa-github"/>
//                     </a>
//                     <a hre="">
//                         <i className="fa fa-telegram"/>
//                     </a>
//                     <a hre="">
//                         <i className="fa fa-twitter"/>
//                     </a>
//                 </div>
//             </div>
//         </div></>)
// }