import React from 'react'
import NegotiationInfo from '../components/NegotiationInfo'
import "../pages/InfoPenawar.scss"

const InfoPenawar = ({ compNav }) => {
  return (
    <div className="infopenawar">
        {compNav}
      <NegotiationInfo/>
    </div>
  )
}

export default InfoPenawar