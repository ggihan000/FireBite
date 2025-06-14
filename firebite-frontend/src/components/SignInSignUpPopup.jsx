import React, { useState } from 'react';
import { Button, Form, Nav } from 'react-bootstrap';
import { login, register } from '../api/api'; // Adjust the import path as necessary

const SignInSignUpPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
      const result = await login({ email, password });
      if (result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "/menu";
      } else {
        setErrorMsg(result.message || "Login failed");
      }
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const phone = e.target.phone.value;
      const password = e.target.password.value;
      const confirm = e.target.confirm.value;

      if (password !== confirm) {
        setErrorMsg("Passwords don't match");
        return;
      }

      const result = await register({ name, email, phone, password });
      if (result.token) {
        localStorage.setItem("token", result.token);
        window.location.href = "/menu";
      } else {
        setErrorMsg(result.message || "Registration failed");
      }
    } catch (err) {
      setErrorMsg(err.message || "Registration failed");
    }
  };



  return (
    <div className="position-fixed top-0 end-0 vh-100 p-4" style={{ zIndex: 1060, width: '100%', maxWidth: 400, backgroundColor: '#1c1c1c', color: 'white', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0">{activeTab === 'signin' ? 'Sign In' : 'Sign Up'}</h5>
        <button className="btn btn-close btn-close-white" onClick={onClose}></button>
      </div>

      <Nav variant="tabs" defaultActiveKey="signin" className="mb-4" onSelect={setActiveTab}>
        <Nav.Item>
          <Nav.Link eventKey="signin" className={`text-white ${activeTab === 'signin' ? 'bg-dark' : ''}`}>Sign In</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="signup" className={`text-white ${activeTab === 'signup' ? 'bg-dark' : ''}`}>Sign Up</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'signin' && (
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Button type="submit" variant="danger" className="w-100 fw-bold">Login</Button>
          {errorMsg && <div className="text-danger text-center mt-2">{errorMsg}</div>}
        </Form>

      )}

      {activeTab === 'signup' && (
        <Form onSubmit={handleRegister}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Full Name" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Form.Group controlId="phone" className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Phone number" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Form.Group controlId="confirm" className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" className="bg-secondary text-white border-0" />
          </Form.Group>
          <Button type="submit" variant="danger" className="w-100 fw-bold">Register</Button>
          {errorMsg && <div className="text-danger text-center mt-2">{errorMsg}</div>}
        </Form>

      )}
    </div>
  );
};

export default SignInSignUpPopup;
