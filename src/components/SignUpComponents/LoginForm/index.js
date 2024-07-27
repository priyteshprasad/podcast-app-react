import React, { useState } from "react";
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    if (email && password) {
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        // console.log("userdata", userData);
        dispatch(
          setUser({
            name: userDoc.name,
            email: user.email,
            uid: user.uid,
          })
        );
        toast.success("login success");
        navigate("/profile");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
      setLoading(false);
    } else {
      toast.error("something went wrong");
    }
  };
  const handleResetPassword = async () => {
    if (email) {
      let signInMethods = await fetchSignInMethodsForEmail(auth, email);
      // google recommend not to use it as an hacker can guess emails using it
      if (signInMethods.length > 0) {
        //user exists
        sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("Email Send successfully");
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
      } else {
         //user does not exist
         toast.error("No User Found. Signup!");
      }
      
    } else {
      toast.error("please enter your email to get varification email");
    }
  };
  return (
    <>
      <InputComponent
        state={email}
        setState={setEmail}
        placeholder="Email"
        type="email"
        required={true}
      />
      <InputComponent
        state={password}
        setState={setPassword}
        placeholder="Password"
        type="password"
        required={true}
      />

      <Button
        text={loading ? "Loading..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
      <p onClick={handleResetPassword} style={{ cursor: "pointer" }}>
        Forgot password? Click here
      </p>
    </>
  );
}

export default Login;
