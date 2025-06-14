import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram, FaUser, FaShoppingCart, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaAngleDown, FaBars } from 'react-icons/fa';
import { Button, Container, Row, Col, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import SignInSignUpPopup from './SignInSignUpPopup'; 
import CartPopup from './CartPopup'; 
import { FaBox, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const CustomNavbar = () => {
  const [showAccount, setShowAccount] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/cart/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await res.json();
        if (res.ok && data.items) {
          setCartCount(data.items.reduce((sum, item) => sum + (item.qty || 1), 0));
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [showCart]);

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <>
      {/* Top Info Bar - Hidden on mobile */}
      <div className="bg-dark text-light py-2 d-none d-lg-block">
        <Container fluid>
          <Row className="align-items-center justify-content-between">
            <Col xs="auto">
              <div className="d-flex gap-3">
                <FaFacebookF />
                <FaTwitter />
                <FaLinkedinIn />
                <FaYoutube />
                <FaInstagram />
              </div>
            </Col>
            <Col className="d-none d-md-flex justify-content-end align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <FaClock /> Sunday Closed
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt /> Caddebostan mahallesi, Kadıköy, Istanbul, 34728
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaPhoneAlt /> +90 546 182 7323
              </div>
              <div className="d-flex align-items-center gap-2">
                <span role="img" aria-label="flag">🇬🇧</span> English
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="px-3 py-3" style={{ backgroundColor: '#252525' }}>
        <Container fluid>
          <Navbar.Brand href="/">
            <img src="/logo.png" alt="Logo" height="50" />
          </Navbar.Brand>
          
          {/* Mobile menu button */}
          <div className="d-flex align-items-center gap-3 d-lg-none">
            <FaUser
              className="text-white fs-5 cursor-pointer"
              onClick={() => setShowAccount(!showAccount)}
            />
            <div className="position-relative">
              <FaShoppingCart
                className="text-white fs-5 cursor-pointer"
                onClick={() => setShowCart(!showCart)}
              />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </div>
            <Button 
              variant="danger" 
              className="border-0 fw-bold d-flex align-items-center"
              onClick={() => setShowMobileMenu(true)}
            >
              <FaBars className="me-2" /> Menu
            </Button>
          </div>

          {/* Desktop menu */}
          <Navbar.Collapse id="navbar-nav" className="justify-content-between">
            <Nav className="mx-auto d-flex align-items-center gap-4 text-uppercase fw-bold">
              <Nav.Link href="/" className="text-danger">Home</Nav.Link>
              <Nav.Link href="/menu" className="text-white">Menu</Nav.Link>
              <div className="position-relative">
                <Nav.Link href="#pages" className="text-white d-flex align-items-center gap-1"
                  onClick={e => { e.preventDefault(); setShowPagesDropdown(v => !v); }}
                  onBlur={() => setTimeout(() => setShowPagesDropdown(false), 200)}
                  tabIndex={0}
                >
                  Pages <FaAngleDown />
                </Nav.Link>
                {showPagesDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, background: '#222', borderRadius: 8, boxShadow: '0 2px 12px #0008', minWidth: 180, zIndex: 1000 }}
                    onMouseDown={e => e.preventDefault()}
                  >
                    <a
                      href="/our-team"
                      className="dropdown-item py-2 px-3 text-white"
                      style={{ textDecoration: 'none', display: 'block', fontWeight: 500, cursor: 'pointer' }}
                      onClick={e => {
                        e.preventDefault();
                        setShowPagesDropdown(false);
                        window.location.href = '/our-team';
                      }}
                    >
                      Our Team
                    </a>
                  </div>
                )}
              </div>
              <Nav.Link href="contact-us" className="text-white">Contact Us</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center gap-5 d-none d-lg-flex">
              <FaUser
                className="text-white fs-5 cursor-pointer"
                onClick={() => setShowAccount(!showAccount)}
              />
              <div className="position-relative">
                <FaShoppingCart
                  className="text-white fs-5 cursor-pointer"
                  onClick={() => setShowCart(!showCart)}
                />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </div>
              <Button className="bg-danger border-0 px-4 py-2 fw-bold" href="/menu">
                Order Now <FaShoppingCart className="ms-2" />
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Menu Offcanvas */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="end" style={{ backgroundColor: '#252525', color: 'white' }}>
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-3 text-uppercase fw-bold">
            <Nav.Link href="/" className="text-danger" onClick={() => setShowMobileMenu(false)}>Home</Nav.Link>
            <Nav.Link href="/menu" className="text-white" onClick={() => setShowMobileMenu(false)}>Menu</Nav.Link>
            <Nav.Link href="/our-team" className="text-white" onClick={() => setShowMobileMenu(false)}>Our Team</Nav.Link>
            <Nav.Link href="contact-us" className="text-white" onClick={() => setShowMobileMenu(false)}>Contact Us</Nav.Link>
            <Button className="bg-danger border-0 py-2 fw-bold mt-3" href="/menu" onClick={() => setShowMobileMenu(false)}>
              Order Now <FaShoppingCart className="ms-2" />
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Popups */}
      {showAccount && (
        isTokenValid() ? (
          <div
            className="position-fixed top-0 end-0 vh-100 p-4"
            style={{
              zIndex: 1060,
              width: '100%',
              maxWidth: 400,
              backgroundColor: '#1c1c1c',
              color: 'white',
              boxShadow: '0 0 10px rgba(255,255,255,0.1)',
            }}
          >
            <div className="d-flex justify-content-end">
              <button
                onClick={() => setShowAccount(false)}
                className="btn btn-sm text-white"
                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem' }}
              >
                <FaTimes />
              </button>
            </div>
            <h4 className="text-center mb-4 text-warning">Account</h4>
            <Button
              variant="outline-light"
              className="fw-bold w-100 d-flex align-items-center justify-content-center gap-2 mb-4 py-3"
              onClick={() => window.location.href = '/my-orders'}
            >
              <FaBox /> My Orders
            </Button>
            <Button
              variant="outline-light"
              className="fw-bold w-100 d-flex align-items-center justify-content-center gap-2 mb-4 py-3"
              onClick={() => window.location.href = '/my-reservations'}
            >
              <FaBox /> My Reservations
            </Button>
            <hr className="text-white" />
            <div className="d-flex justify-content-between">
              <Button
                variant="danger"
                className="fw-bold w-50 py-3 d-flex align-items-center justify-content-center gap-2 me-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </Button>
              <Button
                variant="secondary"
                className="fw-bold w-50 py-3 d-flex align-items-center justify-content-center gap-2 ms-2"
                onClick={() => setShowAccount(false)}
              >
                <FaTimes /> Close
              </Button>
            </div>
          </div>
        ) : (
          <SignInSignUpPopup onClose={() => setShowAccount(false)} />
        )
      )}

      {showCart && (
        <CartPopup onClose={() => setShowCart(false)} />
      )}
    </>
  );
};

export default CustomNavbar;