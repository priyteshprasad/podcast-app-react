import React from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/common/Header';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

function Profile() {
    const user = useSelector((state)=>state.user.user) //.user is name of slice .user is the object inside the slice
    console.log("userState,", user);
    const handleLogout = () => {
      signOut(auth)
      .then(()=>{
        toast.success("User Logged out!")
      })
      .catch((error)=>{
        toast.error(error.message);
      })
    }
    if(!user){
      return <p>Loading</p>
    }else{
      return (
        <div><Header />
        <div>{user.name}</div>
        <div>{user.email}</div>
        <div>{user.uid}</div>
        <Button text={"Logout"} onClick={handleLogout}/>
        </div>
      )

    }
}

export default Profile