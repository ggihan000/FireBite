import React from 'react';
import { Button } from 'react-bootstrap';

function SpecialitySection() {
  const specialities = [
    {
      title: ['Fresh', 'Bun'],
      desc: 'Fresh bun made with soft, fluffy dough, baked to perfection for a light and airy texture.'
    },
    {
      title: ['Fresh', 'Lettuce'],
      desc: 'Crisp and tender, with a vibrant green hue and a refreshing, light flavor that adds the perfect crunch to every bite.'
    },
    {
      title: ['Slice', 'Onion'],
      desc: 'Sliced onion, thinly cut to release its natural sweetness and sharp flavor, perfect for adding texture and taste to a variety of dishes.'
    },
    {
      title: ['Slice', 'Tomato'],
      desc: 'Ripe and juicy, bursting with natural sweetness and rich flavor, perfect for enhancing any burger.'
    },
    {
      title: ['Pure', 'Cheese'],
      desc: 'Made from high-quality milk, brings a perfect balance of creamy, sharp, and savory flavors that enhance and complement every dish it touches.'
    },
    {
      title: ['Delicious', 'Meat'],
      desc: 'Burger meat, typically made from premium ground beef, is seasoned to perfection and cooked to deliver a juicy, tender, and flavorful bite in every burger.'
    }
  ];

  return (
    <div
      style={{
        backgroundImage: "url('/bg-overlay-2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        color: 'white',
        padding: '4rem 0',
      }}
    >
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
        <div className="text-center mb-4">
          <h4 style={{ color: '#ffc107', fontWeight: 600, letterSpacing: 2 }}>Speciality</h4>
          <h2 className="display-5 fw-bold" style={{ color: 'white', marginBottom: 32 }}>Our Special Ingridients</h2>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between" style={{ gap: 32 }}>
          {/* right: Content */}
          <div style={{ flex: 1, color: 'white', textAlign: 'right', maxWidth: 600 , paddingBottom: '7rem' }}>
            {specialities.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 32, textAlign: 'right' }}>
                <h3 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8, textAlign: 'right' }}>
                  <span style={{ color: 'white' }}>{item.title[0]} </span>
                  <span style={{ color: '#ffcc00' }}>{item.title[1]}</span>
                </h3>
                <p style={{ color: 'white', fontSize: 16, margin: 0, textAlign: 'right' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          {/* Right: Image */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img src="/longburger.png" alt="Special Long Burger" style={{ maxWidth: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecialitySection;
