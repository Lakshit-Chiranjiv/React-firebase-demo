import React, { useState } from 'react'
import { Outlet, Link } from "react-router-dom";

const Auth = () => {

  return (
    <div>
      <h1 className='text-center m-3 display-1'>Firebase Restaurent</h1>
      <img src="./../assets/chef.svg" alt="" />
      <div className="d-flex justify-content-center flex-column align-items-center">
          <Link to="/register" className='btn btn-primary w-50 m-2'>Register</Link>
          <br />
          <Link to="/login" className='btn btn-primary w-50 m-2'>Login</Link>
          <br /><br />
      </div>

      <Outlet/>
    </div>
  )
}

export default Auth