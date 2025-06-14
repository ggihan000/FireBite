import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer style={{ background: '#181818', color: 'white', padding: '3rem 1rem 1rem 1rem' }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 32,
        flexWrap: 'wrap',
      }}>
        {/* Our Offer */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <h4 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: '#ffcc00' }}>Our Offer</h4>
          <ul style={{ columns: 2, fontSize: 15, color: 'white', listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              {
                label: 'About Us',
                href: '/our-team'
              },
              // {
              //   label: "FAQ's",
              //   href: '/#faq'
              // },
              // {
              //   label: 'Reservation',
              //   href: '/#reservation'
              // },
              {
                label: 'Contact Us',
                href: '/contact-us'
              },
              {
                label: 'Cart',
                href: '/cart'
              },
              {
                label: 'Teams',
                href: '/our-team'
              },
              // {
              //   label: 'Privacy Policy',
              //   href: '/#privacy'
              // },
              // {
              //   label: 'Terms & Conditions',
              //   href: '/#terms'
              // },
              // {
              //   label: 'Services',
              //   href: '/#services'
              // },
              {
                label: 'My Account',
                href: '/my-orders'
              },
            ].map((item, idx) => (
              <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ color: '#ffcc00', fontSize: 16, display: 'inline-block', marginRight: 6 }}>&#8594;</span>
                <a href={item.href} style={{ color: 'white', textDecoration: 'none', fontSize: 15 }}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        {/* Middle: Logo and contact */}
        <div style={{ flex: 1, minWidth: 220, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <img src="/Logo.png" alt="Logo" style={{ maxWidth: 120, marginBottom: 16 }} />
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            Caddebostan mahallesi, Kadıköy, Istanbul, 34728
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>Hotline:</b> +90 546 182 7323
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>Email:</b> hello@FireBite.com
          </div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <b>Follow Us:</b>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
              <a href="#" style={{ color: 'white', fontSize: 20 }}><FaFacebookF /></a>
              <a href="#" style={{ color: 'white', fontSize: 20 }}><FaTwitter /></a>
              <a href="#" style={{ color: 'white', fontSize: 20 }}><FaInstagram /></a>
              <a href="#" style={{ color: 'white', fontSize: 20 }}><FaLinkedinIn /></a>
              <a href="#" style={{ color: 'white', fontSize: 20 }}><FaYoutube /></a>
            </div>
          </div>
        </div>
        {/* Right: Open Hours */}
        <div style={{ flex: 1, minWidth: 220, textAlign: 'right' }}>
          <h4 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: '#ffcc00', marginRight:'3rem' }}>Open Hours</h4>
          <div style={{ fontSize: 15, marginBottom: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Monday', '08:00 - 21.00'], ['Tuesday', '09:00 - 23.00'], ['Wednesday', '08:00 - 23.00'], ['Thursday', '08:00 - 23.00'], ['Friday', '08:00 - 23.00'], ['Saturday', '08:00 - 23.00'], ['Sunday', 'Closed']].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'flex-end', gap: 18 }}>
                  <span style={{ minWidth: 90, textAlign: 'right', display: 'inline-block' }}>{day}:</span>
                  <span style={{ minWidth: 100, textAlign: 'left', display: 'inline-block' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <hr style={{ borderColor: '#444', margin: '0 5rem' , borderWidth: 3 }} />
      <div style={{ textAlign: 'center', fontSize: 15, color: '#aaa' }}>
        © 2025 FireBite
      </div>
    </div>
  </footer>
);

export default Footer;