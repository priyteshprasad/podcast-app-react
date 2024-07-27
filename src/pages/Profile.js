import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { clearUser } from "../slices/userSlice";

function Profile() {
  const user = useSelector((state) => state.user.user); //.user is name of slice .user is the object inside the slice
  const dispatch = useDispatch()
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("User Logged out!");
        dispatch(clearUser())
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  if (!user) {
    return <Loader />;
  } else {
    return (
      <div>
        <Header />
        <div className="input-wrapper">
          <h2>User Details</h2>
          <div className="grid-container">
            <div className="column-1">
              <h4>User name:</h4>
              <h4>User email:</h4>
              <h4>Uid:</h4>
            </div>
            <div className="column-2">
              <h4>{user.name ? user.name : "NA"}</h4>
              <h4>{user.email}</h4>
              <h4>{user.uid}</h4>
            </div>
          </div>
        <Button text={"Logout"} onClick={handleLogout} />
        </div>
      </div>
    );
  }
}

export default Profile;
