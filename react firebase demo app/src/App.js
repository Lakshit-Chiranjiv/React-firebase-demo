import React from "react";
import AuthInterface from "./components/AuthInterface";
import DbInterface from "./components/DbInterface";
import RegisterInterface from "./components/RegisterInterface";
import LoginInterface from "./components/LoginInterface";
import Auth from "./components/Auth";
import NotFound from "./components/NotFound";
import { BrowserRouter,Route,Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <DbInterface/> */}

      <BrowserRouter>
        <Routes>
        {/* <Route path="/" element={<App />} /> */}
          <Route path="/" element={<Auth />} >
            <Route path="register" element={<RegisterInterface />} />
            <Route path="login" element={<LoginInterface />} />
          </Route>
          <Route path="db" element={<DbInterface />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <AuthInterface/> */}
      </BrowserRouter>
      
    </div>
  );
}

export default App;
