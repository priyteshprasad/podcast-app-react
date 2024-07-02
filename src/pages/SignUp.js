import React, { useState } from 'react'
import Header from '../components/Header'
import SignupForm from '../components/SignUpComponents/SignupForm';
import Login from '../components/SignUpComponents/LoginForm';
function SignUp() {
    const [flag, setFlag] = useState(false)
  return (
    <div>
        <Header />
        <div className='input-wrapper'>
            {!flag ? <h1>Sign Up</h1> : <h1>Login</h1>}
            {!flag ? <SignupForm /> : <Login />}
            {!flag ? <p style={{cursor: 'pointer'}} onClick={()=>setFlag(!flag)}>Already have an account. Login</p> : <p style={{cursor: 'pointer'}} onClick={()=>setFlag(!flag)}>Don't have an account. Signin</p>}  
        </div>
    </div>
  )
}

export default SignUp