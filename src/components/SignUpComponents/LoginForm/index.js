import React, { useState } from "react";
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
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
    console.log("handling login");
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
        console.log("userdata", userData);
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
    </>
  );
}

export default Login;
