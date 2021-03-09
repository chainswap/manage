import React, {useCallback, useEffect} from 'react'
import { useSpring, animated } from 'react-spring'
import {useRemovePopup} from "../../pages/Hooks";
import {CheckCircle, AlertCircle} from 'react-feather'
import {useActiveWeb3React} from "../../web3";

export const PopupItem = ({removeAfterMs, content, popKey, success, hash}) => {
    console.log('hash link--->', hash)
    const removePopup = useRemovePopup()

    const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])

    const { chainId } = useActiveWeb3React()


    useEffect(() => {
        if (removeAfterMs === null) return undefined

        const timeout = setTimeout(() => {
            removeThisPopup()
        }, removeAfterMs)

        return () => {
            clearTimeout(timeout)
        }
    }, [removeAfterMs, removeThisPopup])


    const faderStyle = useSpring({
        from: { width: '100%', position: 'absolute', bottom: 0, left: 0,  height: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' },
        to: { width: '0%', position: 'absolute', bottom: 0, left: 0, height: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)' },
        config: { duration: removeAfterMs ?? undefined }
    })

    return (
        <div className="popup">
            <div className="popup__frame">
                <div className="popup__frame__content">
                    {success? <CheckCircle color={'#27AE60'} size={24}/> : <AlertCircle color={'#FF6871'} size={24}/>}
                    <p>{content}</p>
                </div>

                {chainId &&  <a href={hash} target="_blank">View on Etherscan</a>}
            </div>

            <animated.div style={faderStyle}/>
        </div>
    )
}
