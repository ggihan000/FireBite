import React, { useState } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';

const AddMenuPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    image: null,
    category: '',
  });

  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    data.append('itemName', formData.itemName);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('image', formData.image);
    data.append('category', formData.category);

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        body: data,
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const result = await res.json();

      if (res.ok) {
        setVariant('success');
        setMessage('✅ Menu item created!');
        setFormData({ itemName: '', description: '', price: '', image: null, category: '' });
      } else {
        setVariant('danger');
        setMessage(result.message || 'Failed to create menu item.');
      }
    } catch (err) {
      setVariant('danger');
      setMessage('❌ Server error.');
    }

    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#1c1c1c', minHeight: '100vh', color: 'white' }}>
      <Container className="py-5" style={{ maxWidth: 500 }}>
        <h2 className="text-warning text-center mb-4">Add New Menu Item</h2>

        {message && (
          <Alert variant={variant} className="text-center">
            {message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="itemName" className="mb-3">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="bg-secondary text-white border-0"
              placeholder="e.g. Cheese Pizza"
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-secondary text-white border-0"
              placeholder="Enter a brief description"
              required
            />
          </Form.Group>

          <Form.Group controlId="price" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="bg-secondary text-white border-0"
              placeholder="e.g. 8.99"
              required
            />
          </Form.Group>

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="bg-secondary text-white border-0"
              required
            >
              <option value="">Select category</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Sandwitch">Sandwitch</option>
              <option value="Shake">Shake</option>
              <option value="Ice-Cream">Ice-Cream</option>
              <option value="Dessert">Dessert</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="image" className="mb-4">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="bg-secondary text-white border-0"
              required
            />
          </Form.Group>

          <Button type="submit" variant="danger" className="w-100 fw-bold" disabled={loading}>
            {loading ? 'Uploading...' : 'Create Menu Item'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddMenuPage;
