import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import { db } from './../firebase-config';
import { collection,getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router';

const LoginInterface = () => {

    let navigate = useNavigate();

    const [usersArray,setUsersArray] = useState([]);

    const [loginUsername,setLoginUsername] = useState("");
    const [loginEmail,setLoginEmail] = useState("");
    const [loginPassword,setLoginPassword] = useState("");

    const [loginEmptyError,setLoginEmptyError] = useState(false);
    const [loginExistError,setLoginExistError] = useState(false);
    const [loginUsernameExistError,setLoginUsernameExistError] = useState(false);
    const [loginWrongPasswordError,setLoginWrongPasswordError] = useState(false);

    // const [presentUser,setPresentUser] = useState({});
    // const [showUsername,setShowUsername] = useState(false);
    // const [presentUsername,setPresentUsername] = useState("");

    const UsersCollectionRef = collection(db,"Restaurent_users");

    const getAllUsers = async() => {
        const usersData = await getDocs(UsersCollectionRef);
        setUsersArray(usersData.docs.map((docItem)=> ({...docItem.data()})));
    }

    useEffect(()=>{
        getAllUsers();
    },[]);

    // onAuthStateChanged(auth,(currentUser)=>{
    //     setPresentUser(currentUser);
    // });

    const loginUser = async()=>{
        try {
            if(loginUsername != "" && loginEmail != "" && loginPassword != ""){
                if(usersArray.map((user)=>user.email).includes(loginEmail)){

                    if(usersArray.map((user)=>user.username).includes(loginUsername)){
                        const newUser = await signInWithEmailAndPassword(auth,loginEmail,loginPassword);
                        navigate("/db");
                        // console.log(newUser,newUser.user);
                        // setPresentUsername(loginUsername);
                        // setShowUsername(true);
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

  return (
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
  )
}

export default LoginInterface