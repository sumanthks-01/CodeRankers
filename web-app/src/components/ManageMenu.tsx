import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ManageMenu.css';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  meal_type: string;
  price: number;
  available: boolean;
}

const ManageMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    meal_type: 'breakfast',
    price: '',
    available: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/menu/');
      setMenuItems(response.data.items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/admin/menu/${editingId}/`, data);
        setMessage('Menu item updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/menu/create/', data);
        setMessage('Menu item created successfully!');
      }
      
      resetForm();
      fetchMenuItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving menu item:', error);
      setMessage('Error saving menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      meal_type: item.meal_type,
      price: item.price.toString(),
      available: item.available
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/menu/${id}/delete/`);
        setMessage('Menu item deleted successfully!');
        fetchMenuItems();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting menu item:', error);
        setMessage('Error deleting menu item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      meal_type: 'breakfast',
      price: '',
      available: true
    });
    setEditingId(null);
  };

  return (
    <div className="manage-menu">
      <h2>Manage Menu</h2>
      
      <div className="navigation">
        <Link to="/admin">← Back to Dashboard</Link>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="form-section">
        <h3>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
        
        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Meal Type:</label>
            <select
              value={formData.meal_type}
              onChange={(e) => setFormData({...formData, meal_type: e.target.value})}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Evening Snacks</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (₹):</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({...formData, available: e.target.checked})}
              />
              Available
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? 'Update Item' : 'Create Item'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="items-section">
        <h3>Existing Menu Items</h3>
        
        <table className="items-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Meal Type</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.meal_type}</td>
                <td>₹{item.price}</td>
                <td>{item.available ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(item)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMenu;