import React  from 'react'
import { CrossModalIcon } from "../../icons";

export const UnlockedTokensModal = ({
  setUnlockedOpen,
}) => {

  return (
    <div className="modal">
      <div className="modal__box">
        <form className="form-app" action="/">
          <div className="form-app__inner transction-submitted">
            <div className="emoji emoji--yay">
              <div className="emoji__face">
                <div className="emoji__eyebrows"></div>
                <div className="emoji__mouth"></div>
              </div>
            </div>
            <div className="form-app__title h3">
              <p className="color-gray">
                Your tokens were successfully unlocked
              </p>
              {/* {`${
                rewards &&
                fromWei(
                  (rewards * ((100 - getPercent(stakedTime)) / 100)).toString()
                )
              } GLF`} */}
            </div>
            <button
              type="button"
              className="transction-submitted__btn btn"
              onClick={() => setUnlockedOpen(false)}
            >
              Ok
            </button>
            <button
              type="button"
              className="form-app__close-btn button"
              onClick={() => setUnlockedOpen(false)}
              aria-label="Close"
            >
              <CrossModalIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
