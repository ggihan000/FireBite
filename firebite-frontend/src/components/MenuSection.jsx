import React, { useState } from 'react';

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('Pizza');

  const categories = [
    { name: "Pizza", icon: "\uD83C\uDF55" },
    { name: "Burger", icon: "\uD83C\uDF54" },
    { name: "Sandwitch", icon: "\uD83E\uDD6A" },
    { name: "Shake", icon: "\uD83E\uDD64" },
    { name: "Ice-Cream", icon: "\uD83C\uDF68" },
    { name: "Dessert", icon: "\uD83C\uDF69" }
  ];
  
  // const menuItems = {
  //   Pizza: [
  //     {
  //       id: 1,
  //       name: 'Cheese Pizza',
  //       description: 'Seafood pizza loaded with shrimp, calamari, and mussels on a savory tomato base with melted cheese.',
  //       price: '$22.99',
  //       image: 'pizza1.jpg' // You would replace with actual image paths
  //     },
  //     {
  //       id: 2,
  //       name: 'Pepperoni Pizza',
  //       description: 'Pepperoni pizza topped with spicy pepperoni slices and a generous layer of melted mozzarella cheese.',
  //       price: '$25.99',
  //       image: 'pizza2.jpg'
  //     },
  //     {
  //       id: 3,
  //       name: 'Pepperoni Pizza',
  //       description: 'Pepperoni pizza topped with spicy pepperoni slices and a generous layer of melted mozzarella cheese.',
  //       price: '$25.99',
  //       image: 'pizza2.jpg'
  //     },
  //     {
  //       id: 4,
  //       name: 'Pepperoni Pizza',
  //       description: 'Pepperoni pizza topped with spicy pepperoni slices and a generous layer of melted mozzarella cheese.',
  //       price: '$25.99',
  //       image: 'pizza2.jpg'
  //     },
  //     {
  //       id: 5,
  //       name: 'Pepperoni Pizza',
  //       description: 'Pepperoni pizza topped with spicy pepperoni slices and a generous layer of melted mozzarella cheese.',
  //       price: '$25.99',
  //       image: 'pizza2.jpg'
  //     },
  //     // Add more pizza items as needed
  //   ],
  //   Burger: [],
  //   Sandwitch: [],
  //   Shake: [],
  //   'Ice-Cream': [],
  //   Dessert: []
  // };

  // const scrollLeft = () => {
  //   setScrollPosition(prev => Math.max(0, prev - 300));
  // };

  // const scrollRight = () => {
  //   const container = document.getElementById('items-container');
  //   if (container) {
  //     const maxScroll = container.scrollWidth - container.clientWidth;
  //     setScrollPosition(prev => Math.min(maxScroll, prev + 300));
  //   }
  // };

  return (
    <section 
      className="py-5 text-white"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('menu-bg-overlay.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container">
        <h3 className="text-center" style={{color: 'yellow'}}
        >Menu</h3>
        <h2 className="text-center mb-5" style={{color: 'white', fontWeight: 'bold', marginTop: 0}}>
            Pick Your Favourite</h2>
        
        {/* Category Tabs */}
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
        
        {/* Menu Items with Scroll Controls */}
        {/* <div className="position-relative">
          <button 
            className="position-absolute start-0 top-50 translate-middle-y btn btn-outline-light rounded-circle p-2"
            onClick={scrollLeft}
            style={{ zIndex: 1, left: '-20px' }}
            disabled={scrollPosition === 0}
          >
            <FiChevronLeft size={24} />
          </button>
          
          <div 
            id="items-container"
            className="d-flex overflow-hidden scroll-smooth"
            style={{
              scrollBehavior: 'smooth',
              transform: `translateX(-${scrollPosition}px)`,
              transition: 'transform 0.3s ease',
              background: 'transparent',
              border: 'none'
            }}
          >
            {menuItems[activeCategory]?.map(item => (
              <div key={item.id} className="card me-4" style={{ minWidth: '300px', background: 'transparent', border: 'none', color: 'white', textAlign: 'center' }}>
                <div 
                  className="card-img-top bg-secondary" 
                  style={{ height: '200px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundColor: 'transparent', border: 'none' }}
                ></div>
                <div className="card-body" style={{ background: 'transparent', border: 'none', color: 'white', textAlign: 'center' }}>
                  <h5 className="card-title" style={{ color: 'white', textAlign: 'center' }}>{item.name}</h5>
                  <p className="card-text text-muted" style={{ color: 'white', textAlign: 'center' }}>{item.description}</p>
                  <p className="card-text fw-bold" style={{ color: 'yellow', textAlign: 'center' }}>{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="position-absolute end-0 top-50 translate-middle-y btn btn-outline-light rounded-circle p-2"
            onClick={scrollRight}
            style={{ zIndex: 1, right: '-20px' }}
            disabled={scrollPosition >= (menuItems[activeCategory]?.length * 300 - 300)}
          >
            <FiChevronRight size={24} />
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default MenuSection;