import React, { useState } from 'react';
import { Link, Redirect, useNavigate } from 'react-router-dom'; 
import './Login.css'; 
import { Login, Signup } from '../Api Request/UserRequests';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginSignup() {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate()
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [signupFormData, setSignupFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData({
      ...signupFormData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async(e) => {
    e.preventDefault();
    if (!loginFormData.email || !loginFormData.password) {
      setErrors({ login: 'Please fill in all fields.' });
    } else {
      console.log('Logging in with:', loginFormData);

      const response = await Login(loginFormData)

      if(response?.data?.success){
        localStorage.setItem("user", response?.data?.token)
        toast("User LoggedIn Successfully");

        setTimeout(() => {

         setLoginFormData({
          email: '',
          password: '',
         })
          navigate("/")
         
        }, 1000);
       
     } else{
       toast.error("Something Went Wrong");
       setErrors(response?.data?.message)
     }
      
    }
  };

  const handleSignupSubmit = async (e) => {

    e.preventDefault();
    if (!signupFormData.name || !signupFormData.email || !signupFormData.password) {
      setErrors({ signup: 'Please fill in all fields.' });
    } else {
      console.log('Signing up with:', signupFormData);
      const response = await Signup(signupFormData)

      if(response?.data?.success){
         toast("User Successfully Registered");


         setTimeout(() => {

          setSignupFormData({
            name: '',
            email: '',
            password: '',
          })
          
         }, 1000);
        

      } else{
        toast.error("Something Went Wrong");
        setErrors(response?.data?.message)
      }
    }
  };

  return (
    <div className="login-signup-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Login
        </button>
        <button
          className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => handleTabChange('signup')}
        >
          Signup
        </button>
      </div>
      <div className="form-container">
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={loginFormData.email}
                onChange={handleLoginChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleLoginChange}
              />
            </div>
            {errors.login && <div className="error">{errors.login}</div>}
            <button className="submit-button">Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={signupFormData.name}
                onChange={handleSignupChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={signupFormData.email}
                onChange={handleSignupChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={signupFormData.password}
                onChange={handleSignupChange}
              />
            </div>
            {errors.signup && <div className="error">{errors.signup}</div>}
            <button className="submit-button">Signup</button>
          </form>
        )}

        <Link to="/forgot-password">Forgot Password?</Link>
      </div>


    </div>
  );
}

export default LoginSignup;
