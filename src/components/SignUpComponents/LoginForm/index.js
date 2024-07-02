import React, { useState } from "react";
import InputComponent from "../../Input";
import Button from "../../Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";

function Login() {
     const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogin = async () => {
        console.log("handling login")
        try {
            const userCredentials = await signInWithEmailAndPassword(
                auth, email, password
            )
            const user = userCredentials.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data()
            console.log("userdata", userData)
            dispatch(setUser({
                name: userDoc.name,
                email: user.email,
                uid: user.uid
            }))
            navigate('/profile')
        } catch (error) {
            console.log(error)
        }

    }
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

      <Button text="Login" onClick={handleLogin} />
    </>
  );
}

export default Login;
