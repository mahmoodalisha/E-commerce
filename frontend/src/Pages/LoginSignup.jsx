import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  // State variable to save input field data
  const [formData, setFormData] = useState({
    username: "", 
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This is the API for Login and Signup
  const login = async () => {
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace('/');
      } else {
        console.error('Login failed:', data.errors);
        alert(data.errors);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const signup = async () => {
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('auth-token', data.token);
        window.location.replace('/');
      } else {
        console.error('Signup failed:', data.errors);
        alert(data.errors);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name='username'
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder='Your name'
            />
          )}
          <input
            name='email'
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder='Your email address'
          />
          <input
            name='password'
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder='Password'
          />
        </div>
        <button onClick={() => { state === 'Login' ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already Have an account? <span onClick={() => { setState("Login") }}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create Account <span onClick={() => { setState("Sign Up") }}>Click here</span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms and conditions</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
