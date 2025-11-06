# API Endpoints Contract

## Authentication Module

### POST /api/auth/login/
**Purpose**: Authenticate user and return JWT token
**Request**:
```json
{
  "username": "employee123",
  "password": "password123"
}
```
**Response**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "employee123",
    "is_admin": false,
    "employee_id": "EMP001"
  }
}
```

### POST /api/auth/logout/
**Purpose**: Logout user (invalidate token)
**Headers**: Authorization: Bearer {token}
**Response**: 204 No Content

## Employee Module

### GET /api/menu/tomorrow/
**Purpose**: Get tomorrow's menu items
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "date": "2024-01-15",
  "meals": {
    "breakfast": [
      {"id": 1, "name": "Idli Sambar", "description": "South Indian breakfast"}
    ],
    "lunch": [
      {"id": 2, "name": "Rice & Dal", "description": "Traditional lunch"}
    ],
    "snacks": [
      {"id": 3, "name": "Tea & Biscuits", "description": "Evening snacks"}
    ]
  }
}
```

### GET /api/employee/selections/
**Purpose**: Get employee's current meal selections
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "date": "2024-01-15",
  "selections": {
    "breakfast": [1],
    "lunch": [2],
    "snacks": []
  }
}
```

### POST /api/employee/selections/
**Purpose**: Submit/update meal selections
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "date": "2024-01-15",
  "selections": {
    "breakfast": [1],
    "lunch": [2],
    "snacks": [3]
  }
}
```
**Response**: 201 Created

## Admin Module

### GET /api/admin/menu/
**Purpose**: Get all menu items for management
**Headers**: Authorization: Bearer {token}
**Response**:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Idli Sambar",
      "description": "South Indian breakfast",
      "meal_type": "breakfast",
      "date": "2024-01-15"
    }
  ]
}
```

### POST /api/admin/menu/
**Purpose**: Create new menu item
**Headers**: Authorization: Bearer {token}
**Request**:
```json
{
  "name": "Poha",
  "description": "Maharashtrian breakfast",
  "meal_type": "breakfast",
  "date": "2024-01-15"
}
```
**Response**: 201 Created

### PUT /api/admin/menu/{id}/
**Purpose**: Update menu item
**Headers**: Authorization: Bearer {token}
**Request**: Same as POST
**Response**: 200 OK

### DELETE /api/admin/menu/{id}/
**Purpose**: Delete menu item
**Headers**: Authorization: Bearer {token}
**Response**: 204 No Content

### GET /api/admin/reports/daily/
**Purpose**: Get consolidated daily report
**Headers**: Authorization: Bearer {token}
**Query**: ?date=2024-01-15
**Response**:
```json
{
  "date": "2024-01-15",
  "report": {
    "breakfast": [
      {"item_name": "Idli Sambar", "count": 45}
    ],
    "lunch": [
      {"item_name": "Rice & Dal", "count": 52}
    ],
    "snacks": [
      {"item_name": "Tea & Biscuits", "count": 38}
    ]
  },
  "total_employees": 60
}
```