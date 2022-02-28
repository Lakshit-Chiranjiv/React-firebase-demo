import React from 'react'
import { Outlet, Link } from "react-router-dom";

const Auth = () => {
  return (
    <div>
        <Link to="/register">Register</Link>
        <br />
        <Link to="/login">Login</Link>
        <br /><br />
        <Outlet />
    </div>
  )
}

export default Auth