import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const menuItems = [
  {
    name: 'Cheesy Roll',
    description: 'Delicious cheesy roll with fresh herbs and spices.',
    price: '$5.99',
    image: '/hero1.png',
  },
  {
    name: 'Spicy Burger',
    description: 'Juicy burger packed with spicy flavors.',
    price: '$7.49',
    image: '/hero2.png',
  },
  {
    name: 'Veggie Delight',
    description: 'A healthy and tasty vegetarian meal.',
    price: '$6.25',
    image: '/hero3.png',
  },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % menuItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerWidth = 100 * menuItems.length + '%';
  const slideStyle = {
    transform: `translateX(-${currentIndex * (100 / menuItems.length)}%)`,
    transition: 'transform 0.8s ease-in-out',
    display: 'flex',
    width: containerWidth,
  };

  return (
    <div
      style={{
        backgroundImage: "url('/bg-1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        color: 'white',
      }}
    >
      <div className="overflow-hidden">
        <div style={slideStyle}>
          {menuItems.map(({ name, description, price, image }, index) => (
            <div
              key={index}
              style={{
                width: `${100 / menuItems.length}%`,
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Text Section */}
              <div style={{ flex: '1 1 300px', padding: '1rem', maxWidth: '500px' }}>
                <h1 className="display-4 fw-bold">{name}</h1>
                <p className="lead">{description}</p>
                <h3 style={{ color: '#ffc107' }}>{price}</h3>
                <Button variant="danger" size="lg" href="/menu">Order Now</Button>
              </div>

              {/* Image Section */}
              <div style={{ flex: '1 1 300px', padding: '1rem', textAlign: 'center' }}>
                <img
                  src={image}
                  alt={name}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
