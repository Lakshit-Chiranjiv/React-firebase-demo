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
            <h2 className='ms-0'>Register</h2>
            <label htmlFor="name" className='form-label'>Username</label>
            <input type="text" className='form-control w-25' onChange={(e)=>{setRegisterUsername(e.target.value)}}/>
            <br />
            <label htmlFor="email" className='form-label'>Email</label>
            <input type="email" className='form-control w-25' onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
            <br />
            <label htmlFor="password" className='form-label'>Password</label>
            <input type="text" className='form-control w-25' onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
            <br />
            <div className="d-grid">
                <button className='btn btn-primary w-25 mb-3' onClick={registerUser}>Register</button>
            </div>

            {
                registerEmptyError && 
                <small className='text-danger'>Fill up all the fields!!</small>
            }
            {
                registerExistError && 
                <small className='text-danger'>Email already exists, try to Login !!</small>
            }
            {
                registerUsernameExistError && 
                <small className='text-danger'>Username already exists, try some other username !!</small>
            }
            {
                registerPasswordLengthError && 
                <small className='text-danger'>Password should be at least 6 characters long</small>
            }
        </div>
        <div>
            <h2 className='ms-0'>Login</h2>
            <label htmlFor="name" className='form-label'>Username</label>
            <input type="text" className='form-control w-25' onChange={(e)=>{setLoginUsername(e.target.value)}}/>
            <br />
            <label htmlFor="email" className='form-label'>Email</label>
            <input type="email" className='form-control w-25' onChange={(e)=>{setLoginEmail(e.target.value)}}/>
            <br />
            <label htmlFor="password" className='form-label'>Password</label>
            <input type="text" className='form-control w-25' onChange={(e)=>{setLoginPassword(e.target.value)}}/>
            <br />
            <div className="d-grid">
                <button className='btn btn-primary w-25 mb-3' onClick={loginUser}>Login</button>
            </div>
            {
                loginEmptyError && 
                <small className='text-danger'>Fill up all the fields!!</small>
            }
            {
                loginExistError && 
                <small className='text-danger'>User email doesn't exist, try to Register!!</small>
            }
            {
                loginUsernameExistError && 
                <small className='text-danger'>Username is incorrect!!</small>
            }
            {
                loginWrongPasswordError && 
                <small className='text-danger'>Wrong Password !!</small>
            }
        </div>

        {
            presentUser &&
            <p>{presentUser.email}</p>
        }
        
        <div className="d-grid">
            <button className='btn btn-danger w-25' onClick={logoutUser}>Logout</button>
        </div>
      </div>
  )
}

export default AuthInterface