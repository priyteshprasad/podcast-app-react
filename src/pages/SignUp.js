import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SignupForm from "../components/SignUpComponents/SignupForm";
import Login from "../components/SignUpComponents/LoginForm";
import { useSelector } from "react-redux";
function SignUp() {
  const [flag, setFlag] = useState(false);
  const currUser = useSelector((state) => state.user.user); //.user is name of slice .user is the object inside the slice
  if (currUser) {
    return (
      <>
        <div>
          <Header />
          <div className="input-wrapper">
            <h2>User already logged in</h2>
            <p>User email: {currUser.email}</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <div>
      <Header />
      <div className="input-wrapper">
        {!flag ? <h1>Sign Up</h1> : <h1>Login</h1>}
        {!flag ? <SignupForm /> : <Login />}
        {!flag ? (
          <p style={{ cursor: "pointer" }} onClick={() => setFlag(!flag)}>
            Already have an account. Login
          </p>
        ) : (
          <p style={{ cursor: "pointer" }} onClick={() => setFlag(!flag)}>
            Don't have an account. Signin
          </p>
        )}
      </div>
    </div>
  );
}

export default SignUp;
