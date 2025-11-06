import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './EmployeeHome.css';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  meal_type: string;
  price: number;
  available: boolean;
}

const EmployeeHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selections, setSelections] = useState<{[key: string]: number[]}>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMenuAndSelections();
  }, []);

  const fetchMenuAndSelections = async () => {
    try {
      const [menuResponse, selectionsResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/menu/tomorrow/'),
        axios.get('http://127.0.0.1:8000/api/employee/selections/')
      ]);

      // Flatten menu items from grouped structure
      const allItems: MenuItem[] = [];
      Object.values(menuResponse.data.meals).forEach((items: any) => {
        allItems.push(...items);
      });
      
      setMenuItems(allItems);
      setSelections(selectionsResponse.data.selections);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = async (menuId: number, mealType: string) => {
    const currentSelections = selections[mealType] || [];
    const isSelected = currentSelections.includes(menuId);
    
    const newSelections = {
      ...selections,
      [mealType]: isSelected 
        ? currentSelections.filter(id => id !== menuId)
        : [...currentSelections, menuId]
    };
    
    setSelections(newSelections);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/employee/selections/', {
        selections: newSelections,
        date: new Date().toISOString().split('T')[0]
      });
      
      setMessage(isSelected ? 'Item removed from selection' : 'Item added to selection');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving selection:', error);
      // Revert on error
      setSelections(selections);
    }
  };

  const getMealTypeDisplay = (mealType: string) => {
    const displays: {[key: string]: string} = {
      'breakfast': 'Breakfast',
      'lunch': 'Lunch', 
      'snacks': 'Evening Snacks'
    };
    return displays[mealType] || mealType;
  };

  const isItemSelected = (itemId: number, mealType: string) => {
    return selections[mealType]?.includes(itemId) || false;
  };

  if (loading) {
    return <div className="loading">Loading menu...</div>;
  }

  return (
    <div className="employee-home">
      <h2>Welcome, {user?.username}!</h2>
      <h3>Today's Menu</h3>

      {message && <p className="success-message">{message}</p>}

      <table className="menu-table">
        <thead>
          <tr>
            <th>Meal</th>
            <th>Description</th>
            <th>Meal Type</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{getMealTypeDisplay(item.meal_type)}</td>
              <td>₹{item.price}</td>
              <td>
                <button
                  onClick={() => toggleSelection(item.id, item.meal_type)}
                  className={isItemSelected(item.id, item.meal_type) ? 'cancel-btn' : 'opt-btn'}
                >
                  {isItemSelected(item.id, item.meal_type) ? 'Cancel' : 'Opt In'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="actions">
        <button 
          onClick={() => window.location.href = '/work-status'} 
          className="work-status-btn"
        >
          Set Work Status
        </button>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default EmployeeHome;