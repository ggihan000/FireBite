import React from 'react';

function DownloadAppSection() {
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
      <div className="container" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1rem' }}>
        <div className="d-flex flex-column flex-lg-row align-items-stretch justify-content-between" style={{ gap: 32 }}>
          {/* 1st div: Chicken Burger image, align top */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 400 }}>
            <img src="/ChickenBurger.png" alt="Chicken Burger" style={{ maxWidth: '100%', height: 'auto', alignSelf: 'flex-start' }} />
          </div>
          {/* 2nd div: Delivery Guy image, align bottom */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', minHeight: 400 }}>
            <img src="/deliveryguy.png" alt="Delivery Guy" style={{ maxWidth: '100%', height: 'auto', alignSelf: 'flex-end' }} />
          </div>
          {/* 3rd div: Text and buttons */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', minHeight: 400, color: 'white', textAlign: 'left', gap: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>
              Download Our App <span style={{ color: '#ffcc00' }}>& Order Online</span> To Get Free Delivery
            </h2>
            <p style={{ fontSize: 18, marginBottom: 16 }}>
              We are the country's no.1 Fast food retailer with 15+ years of reputation. Country's best burger and pizza are delivered by us. We gain the satisfaction of our customers with our delicate service and extreme high food quality.
            </p>
            <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
              <button style={{ background: '#e7272d', color: 'white', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Get it on App Store
              </button>
              <button style={{ background: '#e7272d', color: 'white', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Get it on Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadAppSection;
