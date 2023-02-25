import React from "react";
import "./loginform.css";

const Login_form = () =>{
    return (
        <div className="cover">
            <input type="text" placeholder="username" />
            <input type="password" placeholder="password" />

            <div className="login_btn" onClick={popup}>Login</div>

        <div className={popupStyle}>
                <h3>Login Failed</h3>
                <p>Username or password incorrect</p>
            </div>
            
        </div>

        
    )
}

export default Login_form