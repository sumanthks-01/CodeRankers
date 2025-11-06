import requests
import json

BASE_URL = "http://10.120.105.125:8000/api"

def test_endpoint(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Token {token}'
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers)
        elif method == 'PUT':
            response = requests.put(url, json=data, headers=headers)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers)
        
        print(f"{method} {endpoint}: {response.status_code}")
        if response.status_code < 400:
            print("SUCCESS")
        else:
            print("FAILED")
            print(f"Error: {response.text[:200]}")
        return response
    except Exception as e:
        print(f"{method} {endpoint}: ERROR - {str(e)}")
        return None

print("Testing API Endpoints...")
print("=" * 50)

# Test login
print("\n1. Testing Login:")
login_response = test_endpoint('POST', '/auth/login/', {
    'username': 'admin',
    'password': 'admin123'
})

token = None
if login_response and login_response.status_code == 200:
    token = login_response.json().get('token')
    print(f"Token: {token}")

print("\n2. Testing Employee Endpoints:")
test_endpoint('GET', '/menu/tomorrow/', token=token)
test_endpoint('GET', '/employee/selections/', token=token)
test_endpoint('GET', '/employee/my-selections/', token=token)

print("\n3. Testing Admin Endpoints:")
test_endpoint('GET', '/admin/menu/', token=token)
test_endpoint('GET', '/admin/reports/', token=token)
test_endpoint('GET', '/admin/users/', token=token)

print("\n4. Testing Menu Management:")
test_endpoint('POST', '/admin/menu/add/', {
    'name': 'Test Item',
    'description': 'Test Description',
    'meal_type': 'breakfast',
    'price': 30.00,
    'available': True
}, token=token)

print("\nEndpoint testing complete!")