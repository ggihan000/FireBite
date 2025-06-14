import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Message from './components/Message';

import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import AddMenuPage from './pages/AddMenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SingleOrderDetailsPage from './pages/SingleOrderDetailsPage';
import OurTeam from './pages/OurTeam';
import ContactUs from './pages/ContactUs';
import MyReservations from './pages/MyReservations';

import PaypalSuccess from './pages/PaypalSuccess';
import PaypalCancel from './pages/PaypalCancel';


const token = localStorage.getItem('token');
const App = () => (
  <Router>
    <Navbar />
    {token && (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '350px'
      }}>
        <Message />
      </div>
    )}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/add-menu" element={<AddMenuPage />} />
      <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
      <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path="/my-orders" element={<RequireAuth><MyOrdersPage /></RequireAuth>} />
      <Route path="/order/:id" element={<RequireAuth><SingleOrderDetailsPage /></RequireAuth>} />
      <Route path="/paypal/success" element={<PaypalSuccess />} />
      <Route path="/paypal/cancel" element={<PaypalCancel />} />
      <Route path="/our-team" element={<OurTeam />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/my-reservations" element={<RequireAuth><MyReservations /></RequireAuth>} />
    </Routes>
    <Footer />
  </Router>
);

// Simple auth guard HOC
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  let valid = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      valid = payload.exp * 1000 > Date.now();
    } catch {}
  }
  if (!valid) {
    window.location.href = '/';
    return null;
  }
  return children;
};

export default App;
