import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to call API for login/register
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button onClick={onClose} className="close">&times;</button>
        <div className="tabs">
          <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
          <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Register</button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && <input type="text" name="name" placeholder="Name" required />}
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          {!isLogin && <input type="text" name="phone" placeholder="Phone" required />}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;