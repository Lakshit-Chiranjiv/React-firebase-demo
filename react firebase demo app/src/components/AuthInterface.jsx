import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import { db } from './../firebase-config';
import { collection,getDocs,addDoc } from 'firebase/firestore';



const AuthInterface = () => {

    const [usersArray,setUsersArray] = useState([]);

    const [registerUsername,setRegisterUsername] = useState("");
    const [registerEmail,setRegisterEmail] = useState("");
    const [registerPassword,setRegisterPassword] = useState("");

    const [registerEmptyError,setRegisterEmptyError] = useState(false);
    const [registerExistError,setRegisterExistError] = useState(false);
    const [registerUsernameExistError,setRegisterUsernameExistError] = useState(false);
    const [registerPasswordLengthError,setRegisterPasswordLengthError] = useState(false);

    const [loginUsername,setLoginUsername] = useState("");
    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword,setLoginPassword] = useState("");

    const [loginEmptyError,setLoginEmptyError] = useState(false);
    const [loginExistError,setLoginExistError] = useState(false);
    const [loginUsernameExistError,setLoginUsernameExistError] = useState(false);
    const [loginWrongPasswordError,setLoginWrongPasswordError] = useState(false);

    const [presentUser,setPresentUser] = useState({});
    const [showUsername,setShowUsername] = useState(false);
    const [presentUsername,setPresentUsername] = useState("");

    const UsersCollectionRef = collection(db,"Restaurent_users");

    const getAllUsers = async() => {
        const usersData = await getDocs(UsersCollectionRef);
        setUsersArray(usersData.docs.map((docItem)=> ({...docItem.data()})));
        // console.log(usersArray);
    }

    

    useEffect(()=>{
        getAllUsers();
    },[]);

    onAuthStateChanged(auth,(currentUser)=>{
        setPresentUser(currentUser);
    });

    const registerUser = async()=>{
        console.log(usersArray,"mmmmm",usersArray.map((user)=>user.email));
        try {
            if(registerUsername != "" && registerEmail != "" && registerPassword != ""){
                if(registerPassword.length > 5){
                    if(!usersArray.map((user)=>user.email).includes(registerEmail)){

                        if(!usersArray.map((user)=>user.username).includes(registerUsername)){
                            const newUser = await createUserWithEmailAndPassword(auth,registerEmail,registerPassword);
                            console.log(newUser,newUser.user);
                            await addDoc(UsersCollectionRef,{ email: registerEmail,username: registerUsername });
                            getAllUsers();
                            setPresentUsername(registerUsername);
                            setShowUsername(true);
                        }
                        else{
                            setRegisterUsernameExistError(true);
                            setTimeout(()=>{
                                setRegisterUsernameExistError(false);
                            },4000)
                        }
                    }
                    else{
                        setRegisterExistError(true);
                        setTimeout(()=>{
                            setRegisterExistError(false);
                        },4000)
                    }
                }
                else{
                    console.log("password length should be at least 6 characters");
                    setRegisterPasswordLengthError(true);
                    setTimeout(()=>{
                        setRegisterPasswordLengthError(false);
                    },5000)
                }
            }
            else{
                setRegisterEmptyError(true);
                setTimeout(()=>{
                    setRegisterEmptyError(false);
                },4000)
            }
        } 
        catch (error) {
            console.log(error.message);
        }
    }

    const loginUser = async()=>{
        try {
            if(loginUsername != "" && loginEmail != "" && loginPassword != ""){
                if(usersArray.map((user)=>user.email).includes(loginEmail)){

                    if(usersArray.map((user)=>user.username).includes(loginUsername)){
                        const newUser = await signInWithEmailAndPassword(auth,loginEmail,loginPassword);
                        console.log(newUser,newUser.user);
                        setPresentUsername(loginUsername);
                        setShowUsername(true);
                    }
                    else{
                        setLoginUsernameExistError(true);
                        setTimeout(()=>{
                            setLoginUsernameExistError(false);
                        },4000)
                    }
                }
                else{
                    setLoginExistError(true);
                    setTimeout(()=>{
                        setLoginExistError(false);
                    },4000)
                }
            }
            else{
                setLoginEmptyError(true);
                setTimeout(()=>{
                    setLoginEmptyError(false);
                },4000)
            }
        } 
        catch (error) {
            setLoginWrongPasswordError(true);
            setTimeout(()=>{
                setLoginWrongPasswordError(false);
            },5000)
            console.log(error.message);
        }
    }

    const logoutUser = async()=>{
        await signOut(auth);
        setShowUsername(false);
    }

  return (
      <div className='authdiv'>
          {
              showUsername &&
              <h2 className="text-center">{presentUsername}</h2>
          }
        <div>
            <h2>Register</h2>
            <label htmlFor="name">username</label>
            <input type="text" onChange={(e)=>{setRegisterUsername(e.target.value)}}/>
            <br />
            <label htmlFor="name">email</label>
            <input type="email" onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
            <br />
            <label htmlFor="password">password</label>
            <input type="text" onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
            <br />
            <button onClick={registerUser}>Register</button>

            {
                registerEmptyError && 
                <p>Fill up all the fields!!</p>
            }
            {
                registerExistError && 
                <p>Email already exists, try to Login !!</p>
            }
            {
                registerUsernameExistError && 
                <p>Username already exists, try some other username !!</p>
            }
            {
                registerPasswordLengthError && 
                <p>Password should be at least 6 characters long</p>
            }
        </div>
        <div>
            <h2>Login</h2>
            <label htmlFor="name">username</label>
            <input type="text" onChange={(e)=>{setLoginUsername(e.target.value)}}/>
            <br />
            <label htmlFor="name">email</label>
            <input type="email" onChange={(e)=>{setLoginEmail(e.target.value)}}/>
            <br />
            <label htmlFor="password">password</label>
            <input type="text" onChange={(e)=>{setLoginPassword(e.target.value)}}/>
            <br />
            <button onClick={loginUser}>Login</button>
            {
                loginEmptyError && 
                <p>Fill up all the fields!!</p>
            }
            {
                loginExistError && 
                <p>User email doesn't exist, try to Register!!</p>
            }
            {
                loginUsernameExistError && 
                <p>Username is incorrect!!</p>
            }
            {
                loginWrongPasswordError && 
                <p>Wrong Password !!</p>
            }
        </div>

        {
            presentUser &&
            <p>{presentUser.email}</p>
        }
        <button onClick={logoutUser}>Logout</button>
      </div>
  )
}

export default AuthInterface