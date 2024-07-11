import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);

      setLoginSuccess(true);
      setTimeout(() => navigate("/"), 2000); 
    } catch (error) {
      alert("Invalid user details");
      console.error(error);
    }
  };

  const formContainerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: 'sky blue',
    marginTop: '180px', 
  };

  const formTitleStyle = {
    textAlign: 'center',
    color: 'dark blue', 
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '15px',
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '18px',
    color: '#fff',
    backgroundColor: 'dark blue', // Green button background
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#45a049', // Darker green on hover
  };

  return (
    <div className="auth-container" style={formContainerStyle}>
      {loginSuccess ? (
        <div style={{ textAlign: 'center', color: '#4caf50' }}>
          <h2>Login Successful!</h2>
          <p>Redirecting to home page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 style={formTitleStyle}>Login</h2>
          <div className="form-group">
            <label htmlFor="username" style={{ color: '#4caf50' }}>Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ color: '#4caf50' }}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
