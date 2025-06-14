import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { FiShoppingCart } from 'react-icons/fi';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const categories = [
    { name: "Pizza", icon: "\uD83C\uDF55" },
    { name: "Burger", icon: "\uD83C\uDF54" },
    { name: "Sandwitch", icon: "\uD83E\uDD6A" },
    { name: "Shake", icon: "\uD83E\uDD64" },
    { name: "Ice-Cream", icon: "\uD83C\uDF68" },
    { name: "Dessert", icon: "\uD83C\uDF69" }
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load menu");

        setMenuItems(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Add to cart handler
  const handleAddToCart = async (menuId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowLoginAlert(true);
        setTimeout(() => setShowLoginAlert(false), 2000);
        return;
      }
      // Check token expiry
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          setShowLoginAlert(true);
          setTimeout(() => setShowLoginAlert(false), 2000);
          return;
        }
      } catch {
        setShowLoginAlert(true);
        setTimeout(() => setShowLoginAlert(false), 2000);
        return;
      }
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ menuId })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Failed to add to cart');
      } else {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);
      }
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  // Filter menu items by active category
  const filteredMenuItems = menuItems.filter(
    (item) => item.category === activeCategory

    // for now add all items to the active category
    // (item) => true

  );

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white' }}>

        <h2 className="text-warning text-center mb-5 pt-3" style={{ fontSize: '2.5rem' }}>Our Menu</h2>

      {/* Category Tabs UI */}
      <div className="d-flex justify-content-center mb-5">
        <div className="w-100 d-flex justify-content-center gap-5" style={{maxWidth: '1000px', margin: '0 auto'}}>
          {categories.map(category => (
            <button
              key={category.name}
              type="button"
              className={`btn ${activeCategory === category.name ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ color: 'white', background: 'transparent', borderColor: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, gap: 12, boxShadow: 'none' }}
              onClick={() => setActiveCategory(category.name)}
            >
              <span style={{ fontSize: 56, marginBottom: 8 }}>{category.icon}</span>
              <span style={{ color: 'white', fontWeight: 500, fontSize: 16 }}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <Container className="py-5">
        {showLoginAlert && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ background: '#222', color: '#fff', borderRadius: 16, boxShadow: '0 2px 24px #000a', padding: '28px 48px', fontWeight: 'bold', fontSize: '1.25rem', border: '2.5px solid #f44336', display: 'flex', alignItems: 'center', gap: 16, pointerEvents: 'auto', position: 'relative' }}>
              <span style={{ color: '#f44336', fontSize: 28, marginRight: 12 }}>⛔</span>
              Please log in to add items to your cart.
              <button
                onClick={() => setShowLoginAlert(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f44336',
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginLeft: 18,
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 8,
                  right: 12,
                  lineHeight: 1
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {showSuccess && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ background: '#222', color: '#fff', borderRadius: 16, boxShadow: '0 2px 24px #000a', padding: '28px 48px', fontWeight: 'bold', fontSize: '1.25rem', border: '2.5px solid #ffc107', display: 'flex', alignItems: 'center', gap: 16, pointerEvents: 'auto', position: 'relative' }}>
              <FiShoppingCart size={28} color="#ffc107" style={{ marginRight: 12 }} />
              Added to cart!
              <button
                onClick={() => setShowSuccess(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffc107',
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginLeft: 18,
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 8,
                  right: 12,
                  lineHeight: 1
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}


        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="warning" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Row className="g-4">
          {filteredMenuItems.map((item, idx) => {
            const imageUrl = item.image
              ? `/uploads/${item.image}`
              : null;

            return (
              <Col key={idx} xs={12} sm={6} md={4} lg={3} className="d-flex">
                <div
                  className="w-100 d-flex flex-column justify-content-between rounded-4 overflow-hidden"
                  style={{ backgroundColor: '#111', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={item.itemName}
                      className="w-100"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                    <h5 className="text-white mb-1" style={{ fontWeight: 'bold' }}>{item.itemName}</h5>
                    <p className="mb-2" style={{ color: '#aaa', fontSize: '0.9rem' }}>{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold text-warning" style={{ fontSize: '1.1rem' }}>${item.price}</span>
                        <span style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.95rem', marginLeft: 8 }}>
                          ${ (item.price * 1.15).toFixed(2) }
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(item.menuId || item.id)}
                        variant="warning"
                        style={{
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: 0
                        }}
                      >
                        <FiShoppingCart size={20} color="#000" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default MenuPage;
