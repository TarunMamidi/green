import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';


const LoginSignup = ({ onLogin, setUserRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4001/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const { name, role } = response.data;

        setUserRole(role); 

        onLogin(name, role);
      } else {
        setLoginError(response.data.errors || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setLoginError('An error occurred during login.');
    }
  };

  return (
    <div className={'auth-container'}>
      <div className="auth-form-container">
        <div className="auth-info">
          <h2>{'Welcome Back!'}</h2>
          <p>{'Login to your account'}</p>
        </div>
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <h1>{'Login'}</h1>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={changeHandler} required />
            </label>
            <label>
              Password:
              <input type="password" name="password" value={formData.password} onChange={changeHandler} required />
            </label>
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
