import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import { db } from './../firebase-config';
import { collection,getDocs,addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';

const RegisterInterface = ({setPresentUsername}) => {

    let navigate = useNavigate();

    const [usersArray,setUsersArray] = useState([]);

    const [registerUsername,setRegisterUsername] = useState("");
    const [registerEmail,setRegisterEmail] = useState("");
    const [registerPassword,setRegisterPassword] = useState("");

    const [registerEmptyError,setRegisterEmptyError] = useState(false);
    const [registerExistError,setRegisterExistError] = useState(false);
    const [registerUsernameExistError,setRegisterUsernameExistError] = useState(false);
    const [registerPasswordLengthError,setRegisterPasswordLengthError] = useState(false);

    const UsersCollectionRef = collection(db,"Restaurent_users");

    const getAllUsers = async() => {
        const usersData = await getDocs(UsersCollectionRef);
        setUsersArray(usersData.docs.map((docItem)=> ({...docItem.data()})));
    }


    useEffect(()=>{
        getAllUsers();
    },[]);


    const registerUser = async()=>{
        console.log(usersArray,"mmmmm",usersArray.map((user)=>user.email));
        try {
            if(registerUsername != "" && registerEmail != "" && registerPassword != ""){
                if(registerPassword.length > 5){
                    if(!usersArray.map((user)=>user.email).includes(registerEmail)){

                        if(!usersArray.map((user)=>user.username).includes(registerUsername)){
                            const newUser = await createUserWithEmailAndPassword(auth,registerEmail,registerPassword);
                            await addDoc(UsersCollectionRef,{ email: registerEmail,username: registerUsername });
                            setPresentUsername(registerUsername);
                            navigate("/db");
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




    return (
          <div className='container mb-4'>
              <h2 className='ms-0 text-center display-3'>Register</h2>
              <label htmlFor="name" className='form-label'>Username</label>
              <input type="text" className='form-control' onChange={(e)=>{setRegisterUsername(e.target.value)}}/>
              <br />
              <label htmlFor="email" className='form-label'>Email</label>
              <input type="email" className='form-control' onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
              <br />
              <label htmlFor="password" className='form-label'>Password</label>
              <input type="text" className='form-control' onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
              <br />
              <div className="d-grid">
                  <button className='btn btn-primary mb-3' onClick={registerUser}>Register</button>
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
    )
}

export default RegisterInterface