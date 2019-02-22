import React from 'react'
import { getUser } from './services/auth'

const Profile = (data) => {
  const user = getUser()
  console.log(data)
  return (
    <>
      <h1>Your profile</h1>
      <ul>
        <li>Name: {user.user_metadata && user.user_metadata.full_name}</li>
        <li>E-mail: {user.email}</li>
      </ul>
    </>
  )
}

export default Profile