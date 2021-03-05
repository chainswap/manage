import React, { useContext, useState } from 'react';
import { useActiveWeb3React } from '../../web3';
import { formatAddress, formatAmount } from '../../utils/format';
import { mainContext } from '../../reducer';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {CopyToClipboard} from "react-copy-to-clipboard";
import {ReactComponent as Copy} from "../../assets/icon/copy.svg";

export const Header = () => {
    const { active, account } = useActiveWeb3React();
    const { dispatch } = useContext(mainContext);

    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();

    const handleMenuItemClick = () => {
        setShowMenu(false);
    };

    return (
        <header
            className={`header ${showMenu ? 'menu-show' : ''}`}
            style={
                location.pathname === '/' ? { borderBottom: 'transparent' } : {}
            }>
            <div className='center'>
                <header>
                    {active && account && (
                        <div className="wallet">
                            {/*<p className="wallet__balance">{balance ? formatAmount(balance, 18, 2) : '--'} MATTER</p>*/}
                            <p className="wallet__address">
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
                    )}
                </header>
            </div>
        </header>
    );
};
