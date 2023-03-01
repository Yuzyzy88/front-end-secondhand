import React from "react"
import FormProfile from "../components/FormProfile"

import "../pages/Profile.scss"

const Profile = ({ compNav }) => {
  return (
    <div className="profile">
      {compNav}
      <FormProfile />
    </div>
  )
}

export default Profile