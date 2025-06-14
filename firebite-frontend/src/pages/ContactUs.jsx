import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Your message has been sent! We will contact you soon.');
    e.target.reset();
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <Container>
          <h1 className="display-4 fw-bold mb-4" style={{ color: '#ffc107' }}>CONTACT US</h1>
          <p className="lead" style={{ color: '#fff' }}>We'd love to hear from you! Reach out with any questions or feedback.</p>
        </Container>
      </div>

      {/* Contact Information */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Contact Details */}
          <Col lg={4} className="mb-4 mb-lg-0">
            <div className="p-4" style={{ backgroundColor: '#181818', color: 'white', borderRadius: '8px', height: '100%' }}>
              <h3 className="mb-4" style={{ color: '#ffc107' }}>GET IN TOUCH</h3>
              
              <div className="d-flex align-items-start mb-4">
                <FaMapMarkerAlt className="mt-1 me-3 text-danger" size={20} />
                <div>
                  <h5>Address</h5>
                  <p className="mb-0">Caddebostan mahallesi, Kadıköy, Istanbul, 34728</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <FaPhoneAlt className="mt-1 me-3 text-danger" size={20} />
                <div>
                  <h5>Hotline</h5>
                  <p className="mb-0">+90 546 182 7323</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <FaEnvelope className="mt-1 me-3 text-danger" size={20} />
                <div>
                  <h5>Email</h5>
                  <p className="mb-0">hello@FireBite.com</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-4">
                <FaClock className="mt-1 me-3 text-danger" size={20} />
                <div>
                  <h5>Opening Hours</h5>
                  <p className="mb-0">Monday - Friday: 9:00 - 22:00</p>
                  <p className="mb-0">Saturday: 10:00 - 23:00</p>
                  <p className="mb-0">Sunday: Closed</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="mb-3">Follow Us</h5>
                <div className="d-flex gap-3">
                  <a href="#" className="text-white"><FaFacebookF size={20} /></a>
                  <a href="#" className="text-white"><FaTwitter size={20} /></a>
                  <a href="#" className="text-white"><FaInstagram size={20} /></a>
                  <a href="#" className="text-white"><FaLinkedinIn size={20} /></a>
                  <a href="#" className="text-white"><FaYoutube size={20} /></a>
                </div>
              </div>
            </div>
          </Col>

          {/* Contact Form */}
          <Col lg={8}>
            <div className="p-4" style={{ backgroundColor: '#111', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
              <h3 className="mb-4" style={{ color: '#ffc107' }}>SEND US A MESSAGE</h3>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="formName">
                      <Form.Label style={{ color: '#fff' }}>Your Name *</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formEmail">
                      <Form.Label style={{ color: '#fff' }}>Your Email *</Form.Label>
                      <Form.Control type="email" placeholder="Enter your email" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formPhone">
                      <Form.Label style={{ color: '#fff' }}>Phone Number</Form.Label>
                      <Form.Control type="tel" placeholder="Enter your phone number" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formSubject">
                      <Form.Label style={{ color: '#fff' }}>Subject</Form.Label>
                      <Form.Control type="text" placeholder="Enter subject" />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="formMessage">
                      <Form.Label style={{ color: '#ffc107' }}>Your Message *</Form.Label>
                      <Form.Control as="textarea" rows={5} placeholder="Enter your message" required style={{ backgroundColor: '#181818', color: 'white', border: '1px solid #ffc107' }} />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button variant="danger" type="submit" className="px-4 py-2 fw-bold">
                      SEND MESSAGE
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default ContactUs;