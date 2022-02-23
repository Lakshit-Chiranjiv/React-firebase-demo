import React, { useState } from 'react';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

const AuthInterface = () => {

    // const [registerUsername,setRegisterUsername] = useState("");
    const [registerEmail,setRegisterEmail] = useState("");
    const [registerPassword,setRegisterPassword] = useState("");

    // const [loginUsername,setLoginUsername] = useState("");
    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword,setLoginPassword] = useState("");

    const [presentUser,setPresentUser] = useState({});

    onAuthStateChanged(auth,(currentUser)=>{
        setPresentUser(currentUser);
    })

    const registerUser = async()=>{
        try {
            const newUser = await createUserWithEmailAndPassword(auth,registerEmail,registerPassword);
            console.log(newUser,newUser.user);

        } 
        catch (error) {
            console.log(error.message);
        }
    }

    const loginUser = async()=>{
        try {
            const newUser = await signInWithEmailAndPassword(auth,loginEmail,loginPassword);
            console.log(newUser,newUser.user);

        } 
        catch (error) {
            console.log(error.message);
        }
    }

    const logoutUser = async()=>{
        await signOut(auth);
    }

  return (
      <div className='authdiv'>
        <div>
            <h2>Register</h2>
            {/* <label htmlFor="name">username</label>
            <input type="text" onChange={(e)=>{setRegisterUsername(e.target.value)}}/>
            <br /> */}
            <label htmlFor="name">email</label>
            <input type="email" onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
            <br />
            <label htmlFor="password">password</label>
            <input type="text" onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
            <br />
            <button onClick={registerUser}>Register</button>
        </div>
        <div>
            <h2>Login</h2>
            {/* <label htmlFor="name">username</label>
            <input type="text" onChange={(e)=>{setLoginUsername(e.target.value)}}/>
            <br /> */}
            <label htmlFor="name">email</label>
            <input type="email" onChange={(e)=>{setLoginEmail(e.target.value)}}/>
            <br />
            <label htmlFor="password">password</label>
            <input type="text" onChange={(e)=>{setLoginPassword(e.target.value)}}/>
            <br />
            <button onClick={loginUser}>Login</button>
        </div>

        {/* <p></p> */}
        {
            presentUser &&
            <p>{presentUser.email}</p>
        }
        <button onClick={logoutUser}>Logout</button>
      </div>
  )
}

export default AuthInterface