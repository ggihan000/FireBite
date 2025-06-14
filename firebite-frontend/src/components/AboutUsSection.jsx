import React from 'react';
import { Button } from 'react-bootstrap';

const AboutUsSection = () => {
  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '4rem 2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Text Section */}
        <div style={{ flex: '1 1 500px', padding: '1rem' }}>
          <h5 style={{ color: '#ffc107', fontWeight: 'bold' }}>Welcome To FireBite</h5>
          <h1 style={{ fontWeight: '800', fontSize: '2.5rem', lineHeight: '1.3' }}>
            your go-to destination for<br />
            delicious, affordable, and<br />
            freshly prepared fast food.
          </h1>
          <p style={{ color: '#ccc', marginTop: '1rem' }}>
            Whether you're craving juicy burgers, crispy fries, or refreshing beverages,
            FireBite delivers flavor and speed without compromising quality. Perfect for
            lunch breaks, family meals, or late-night cravings, our friendly service and
            casual atmosphere make every visit a satisfying experience.
          </p>
          <Button
            variant="danger"
            size="lg"
            style={{
              borderRadius: '999px',
              padding: '0.75rem 2rem',
              marginTop: '1.5rem',
            }}
            href="/our-team"
          >
            More About Us <span style={{ marginLeft: '0.5rem' }}>➜</span>
          </Button>
        </div>

        {/* Image Section */}
        <div
          style={{
            flex: '1 1 400px',
            padding: '1rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <img
            src="/res3.jpeg"
            alt="Quality Sign"
            style={{ width: '180px', height: 'auto', borderRadius: '12px' }}
          />
          <img
            src="/res2.jpeg"
            alt="Burger Quote"
            style={{ width: '180px', height: 'auto', borderRadius: '12px', marginBottom: '1rem', marginTop: '1rem' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;
