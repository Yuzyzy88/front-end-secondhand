import React from 'react'
import "../pages/Sell.scss"

const Sell = ({
    compNav,
    compForm,
}) => {
  return (
    <div className='sell'>
        {compNav}
        {compForm}
    </div>
  )
}

export default Sell