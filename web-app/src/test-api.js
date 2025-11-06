// Test API connection
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test basic connection
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

// Run test
testAPI();