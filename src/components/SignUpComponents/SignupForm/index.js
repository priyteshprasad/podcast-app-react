import React, { useState } from 'react'
import InputComponent from '../../Input';
import Button from '../../Button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db} from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignup = async () => {
        console.log("handling signup")
        if(password.length > 6 && password === confirmPassword){
            try {
                // creating user account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("user", user);

                // saving the user in database
                // 'users' is the name of collection
                // without user.uid, the id will be random
                await setDoc(doc(db, 'users', user.uid), {
                    name: fullName,
                    email: user.email,
                    uid: user.uid
                })
                // call redux action to save user
                dispatch(setUser({
                    name: fullName,
                    email:user.email,
                    uid: user.uid
                }))
                navigate("/profile");
            }catch(err){
                console.log(err)
            }
        }else{
            console.log("invalide password")
        }
    }
  return (
    <>
        <InputComponent 
                state={fullName}
                setState={setFullName}
                placeholder="Full Name"
                type="text"
                required={true}
            />
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
            <InputComponent 
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder="Confirm Password"
                type="password"
                required={true}
            />
            <Button text="Sign Up" onClick={handleSignup}/>
    </>
  )
}

export default SignupForm