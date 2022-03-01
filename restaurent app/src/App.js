import React, { useState } from "react";
import AuthInterface from "./components/AuthInterface";
import DbInterface from "./components/DbInterface";
import RegisterInterface from "./components/RegisterInterface";
import LoginInterface from "./components/LoginInterface";
import Auth from "./components/Auth";
import NotFound from "./components/NotFound";
import { BrowserRouter,Route,Routes } from "react-router-dom";

function App() {

    const [presentUsername,setPresentUsername] = useState("");

  return (
    <div className="App">
      {/* <DbInterface/> */}

      <BrowserRouter>
        
        <Routes>
        {/* <Route path="/" element={<App />} /> */}
          <Route path="/" element={<Auth />} >
            <Route path="register" element={<RegisterInterface setPresentUsername={setPresentUsername} />} />
            <Route path="login" element={<LoginInterface setPresentUsername={setPresentUsername}/>}  />
          </Route>
          <Route path="db" element={<DbInterface presentUsername={presentUsername} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <AuthInterface/> */}
      </BrowserRouter>
      
    </div>
  );
}

export default App;
