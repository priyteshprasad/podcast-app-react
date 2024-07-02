import React from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header';

function Profile() {
    const user = useSelector((state)=>state.user.user) //.user is name of slice .user is the object inside the slice
    console.log("userState,", user);
  return (
    <div><Header />
    <div>{user.name}</div>
    <div>{user.email}</div>
    <div>{user.uid}</div>
    </div>
  )
}

export default Profile