// Simple connection test
const axios = require('axios');

const testConnection = async () => {
  try {
    console.log('Testing connection to Django backend...');
    
    const response = await axios.post('http://10.120.105.125:8000/api/auth/login/', {
      username: 'cook',
      password: '123'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Connection successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
};

testConnection();