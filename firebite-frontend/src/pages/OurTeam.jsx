import React from 'react';

const teamMembers = [
  {
    name: 'Anthony Basel',
    role: 'Dessert Artist',
    image: '/chef1.jpeg', // Replace with your actual image paths
  },
  {
    name: 'Julia Margareta',
    role: 'Senior Chef',
    image: '/chef2.jpeg',
  },
  {
    name: 'Victor James',
    role: 'Senior Chef',
    image: '/chef3.jpeg',
  },
  {
    name: 'Angela Carter',
    role: 'Junior Chef',
    image: '/chef4.jpeg',
  },
  {
    name: 'Sarp Cesmeli',
    role: 'Pizza Chef',
    image: '/chef5.jpeg',
  },
  {
    name: 'Terzi Enver',
    role: 'Pizza Chef',
    image: '/chef6.jpeg',
  },
  {
    name: 'Nisan Cesmeli',
    role: 'Senior Chef',
    image: '/chef7.jpeg',
  },
  {
    name: 'Nezir Altan',
    role: 'Senior Chef',
    image: '/chef8.jpeg',
  },
];

const OurTeam = () => {
  return (
    <div style={{ backgroundColor: '#000', color: 'white', padding: '2rem' }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#FFD700' }}>Our Team</h2>
      <div className="row g-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card bg-dark border-0 text-center h-100">
              <img
                src={member.image}
                alt={member.name}
                className="card-img-top rounded"
                style={{ objectFit: 'cover', height: '250px' }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold mb-1" style={{ color: '#FFD700' }}>{member.name}</h5>
                <p className="card-text text-muted">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
