import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { Reset } from '../Api Request/UserRequests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function generateRandomCode() {
  return Math.floor(1000 + Math.random() * 9000);
}

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    verificationCode: '',
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const [emailError, setEmailError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    clearValidationErrors(name);
  };

  const clearValidationErrors = (fieldName) => {
    if (fieldName === 'email') {
      setEmailError('');
    } else if (fieldName === 'newPassword') {
      setNewPasswordError('');
    } else if (fieldName === 'verificationCode') {
      setVerificationCodeError('');
    }
  };

  const generateVerificationCode = () => {
    const code = generateRandomCode();
    setGeneratedCode(code);
    setMessage(`Verification code: ${code}`);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!formData.email) {
      setEmailError('Email is required');
      hasError = true;
    }

    if (!formData.newPassword) {
      setNewPasswordError('New password is required');
      hasError = true;
    }

    if (!formData.verificationCode) {
      setVerificationCodeError('Verification code is required');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (formData.verificationCode == generatedCode && formData.newPassword) {
      const {verificationCode, ...newData} = formData

      const response = await Reset(newData)

      console.log(response)

      if(response?.data.success){

        toast("Password Reset Successful")
        
        navigate("/login")


      } else{
      setMessage(response?.data?.message);

      }

    }
    
    else {
      setMessage('Please enter the correct verification code and a new password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Password</h2>
      <form>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <div className="validation-message">{emailError}</div>
        </div>
        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
          <div className="validation-message">{newPasswordError}</div>
        </div>
        <div className="input-group">
          <label>Verification Code</label>
          <input
            type="text"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleInputChange}
          />
          <div className="validation-message">{verificationCodeError}</div>
        </div>
        <button className="reset-button" onClick={handleResetPassword}>
          Reset Password
        </button>
        <button className="generate-code-button" type="button" onClick={generateVerificationCode}>
          Generate Verification Code
        </button>
        {message && <div className="message">{message}</div>}
      </form>
      <Link to="/login" className="back-link">
        Back to Login
      </Link>
    </div>
  );
}

export default ForgotPassword;
