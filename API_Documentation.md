# Hospital Inventory Management System API Documentation

## Overview

The Hospital Inventory Management System API is a comprehensive RESTful API designed to manage hospital inventory, requisitions, dispatches, assets, and user management across multiple facilities. The system supports role-based access control with four main user roles: Super Admin, Warehouse Admin, Facility Admin, and Facility User.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [User Roles & Permissions](#user-roles--permissions)
3. [API Flow](#api-flow)
4. [Authentication](#authentication)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [File Upload (Cloudinary)](#file-upload-cloudinary)
10. [Deployment](#deployment)

## System Architecture

The system follows a modular architecture with clear separation of concerns:

```
├── controllers/          # Business logic
├── routes/              # API route definitions
├── middleware/          # Authentication, validation, error handling
├── config.js           # Database and Cloudinary configuration
├── index.js            # Application entry point
└── .env                # Environment variables
```

### Key Features

- **Role-based Access Control**: Four distinct user roles with specific permissions
- **Multi-facility Support**: Manage multiple hospital facilities
- **Inventory Management**: Track stock levels, movements, and reorder points
- **Requisition Workflow**: Complete request-to-delivery workflow
- **Asset Management**: Track medical equipment and other assets
- **Image Upload**: Cloudinary integration for asset images
- **Comprehensive Reporting**: Stock, requisition, facility usage, and asset reports
- **Real-time Dashboard**: Role-specific dashboard views

## User Roles & Permissions

### 1. Super Admin
- **Access**: System-wide access to all features
- **Capabilities**:
  - Manage all facilities, users, and system settings
  - View global inventory and requisitions
  - Generate comprehensive reports
  - Override any workflow decisions

### 2. Warehouse Admin
- **Access**: Warehouse operations and facility requisitions
- **Capabilities**:
  - Manage warehouse inventory
  - Approve/reject facility requisitions
  - Create and manage dispatches
  - View warehouse-specific reports

### 3. Facility Admin
- **Access**: Single facility management
- **Capabilities**:
  - Manage facility inventory and users
  - Process user requisitions
  - Raise bulk requisitions to warehouse
  - Confirm deliveries from warehouse
  - Manage facility assets

### 4. Facility User
- **Access**: Limited to personal requisitions and facility inventory view
- **Capabilities**:
  - Create personal requisitions
  - View facility inventory (read-only)
  - Track personal request status
  - Receive notifications

## API Flow

### Complete Requisition Flow

```mermaid
graph TD
    A[Facility User Creates Requisition] --> B[Facility Admin Reviews]
    B --> C{Stock Available?}
    C -->|Yes| D[Direct Delivery to User]
    C -->|No| E[Raise Bulk Requisition to Warehouse]
    E --> F[Warehouse Admin Reviews]
    F --> G{Approve?}
    G -->|Yes| H[Create Dispatch]
    G -->|No| I[Reject Requisition]
    H --> J[Facility Admin Confirms Receipt]
    J --> K[Deliver to User]
    D --> L[Mark as Completed]
    K --> L
    I --> M[Notify Facility Admin]
```

### Key Workflows

1. **User Requisition Flow**:
   - User creates requisition → Facility Admin processes → Direct delivery or warehouse request

2. **Warehouse Approval Flow**:
   - Facility raises bulk request → Warehouse Admin approves → Stock dispatched → Facility confirms receipt

3. **Inventory Management Flow**:
   - Stock movements tracked → Automatic reorder alerts → Replenishment workflow

4. **Asset Management Flow**:
   - Asset registration → Assignment tracking → Maintenance scheduling → Retirement

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid Bearer token.

### Login Process
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@hospital.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@hospital.com",
      "role": "facility_admin",
      "facility_id": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Using the Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/profile` | Get user profile | Authenticated |
| PUT | `/api/auth/profile` | Update profile | Authenticated |
| POST | `/api/auth/change-password` | Change password | Authenticated |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Super Admin, Facility Admin |
| GET | `/api/users/:id` | Get user by ID | Role-based |
| POST | `/api/users` | Create user | Super Admin, Facility Admin |
| PUT | `/api/users/:id` | Update user | Role-based |
| DELETE | `/api/users/:id` | Delete user | Super Admin |

### Facility Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/facilities` | Get all facilities | Authenticated |
| GET | `/api/facilities/:id` | Get facility by ID | Authenticated |
| GET | `/api/facilities/:id/stats` | Get facility statistics | Role-based |
| POST | `/api/facilities` | Create facility | Super Admin |
| PUT | `/api/facilities/:id` | Update facility | Super Admin |
| DELETE | `/api/facilities/:id` | Delete facility | Super Admin |

### Inventory Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/inventory` | Get inventory items | Authenticated |
| GET | `/api/inventory/:id` | Get inventory item | Authenticated |
| GET | `/api/inventory/:id/movements` | Get stock movements | Authenticated |
| GET | `/api/inventory/categories` | Get categories | Authenticated |
| POST | `/api/inventory` | Create inventory item | Admin roles |
| PUT | `/api/inventory/:id` | Update inventory item | Admin roles |
| PATCH | `/api/inventory/:id/stock` | Update stock quantity | Admin roles |
| DELETE | `/api/inventory/:id` | Delete inventory item | Super Admin, Warehouse Admin |

### Requisition Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/requisitions` | Get requisitions | Authenticated |
| GET | `/api/requisitions/:id` | Get requisition by ID | Role-based |
| POST | `/api/requisitions` | Create requisition | Authenticated |
| PUT | `/api/requisitions/:id` | Update requisition | Role-based |
| PATCH | `/api/requisitions/:id/approve` | Approve requisition | Warehouse Admin |
| PATCH | `/api/requisitions/:id/deliver` | Deliver requisition | Facility Admin |
| DELETE | `/api/requisitions/:id` | Delete requisition | Role-based |

### Dispatch Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/dispatches` | Get dispatches | Authenticated |
| GET | `/api/dispatches/:id` | Get dispatch by ID | Role-based |
| POST | `/api/dispatches` | Create dispatch | Warehouse Admin |
| PATCH | `/api/dispatches/:id/status` | Update dispatch status | Warehouse Admin |
| PATCH | `/api/dispatches/:id/confirm` | Confirm delivery | Facility Admin |

### Asset Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/assets` | Get assets | Authenticated |
| GET | `/api/assets/:id` | Get asset by ID | Role-based |
| POST | `/api/assets` | Create asset | Admin roles |
| PUT | `/api/assets/:id` | Update asset | Admin roles |
| POST | `/api/assets/:id/image` | Upload asset image | Admin roles |
| DELETE | `/api/assets/:id` | Delete asset | Super Admin, Warehouse Admin |

### Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/reports/stock` | Stock report | Authenticated |
| GET | `/api/reports/requisitions` | Requisition report | Authenticated |
| GET | `/api/reports/facility-usage` | Facility usage report | Authenticated |
| GET | `/api/reports/assets` | Asset report | Authenticated |
| GET | `/api/reports/export/:type` | Export report | Authenticated |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/dashboard` | Get dashboard data | Authenticated |

## Database Schema

### Core Tables

1. **facilities**: Hospital facilities/branches
2. **users**: System users with role-based access
3. **inventory**: Stock items across facilities
4. **requisitions**: User requests for items
5. **requisition_items**: Items within each requisition
6. **dispatches**: Shipments from warehouse to facilities
7. **assets**: Medical equipment and other assets
8. **stock_movements**: Audit trail for inventory changes

### Key Relationships

- Users belong to facilities (except Super Admin)
- Inventory items can be facility-specific or warehouse stock
- Requisitions link users, facilities, and requested items
- Dispatches track shipments from warehouse to facilities
- Assets are assigned to facilities and users

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default**: 100 requests per 15 minutes per IP
- **Configurable**: Via environment variables
- **Headers**: Rate limit info included in response headers

## File Upload (Cloudinary)

Asset images are uploaded to Cloudinary for efficient storage and delivery.

### Configuration
```javascript
cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});
```

### Upload Process
1. Client uploads image via multipart form data
2. Server validates file type and size
3. Image uploaded to Cloudinary with transformations
4. URL stored in database
5. Optimized image served via Cloudinary CDN

## Deployment

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_inventory

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=production

# Cloudinary
CLOUDINARY_CLOUD_NAME=dkqcqrrbp
CLOUDINARY_API_KEY=418838712271323
CLOUDINARY_API_SECRET=p12EKWICdyHWx8LcihuWYqIruWQ
```

### Installation Steps

1. **Clone and Install**:
   ```bash
   git clone <repository>
   cd hospital-inventory-api
   npm install
   ```

2. **Database Setup**:
   ```bash
   mysql -u root -p < database_schema.sql
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Application**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Health Check

The API provides a health check endpoint:

```http
GET /health
```

Response:
```json
{
  "status": "OK",
  "message": "Hospital Inventory API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

## Testing with Postman

Import the provided Postman collection (`Hospital_Inventory_API.postman_collection.json`) to test all endpoints. The collection includes:

- Pre-configured environment variables
- Authentication token management
- Sample requests for all endpoints
- Test scripts for automated token handling

### Quick Start Testing

1. Import the Postman collection
2. Set the `base_url` variable to your API URL
3. Run the "Login" request to get an authentication token
4. The token will be automatically set for subsequent requests
5. Test other endpoints as needed

This API provides a complete solution for hospital inventory management with robust security, comprehensive features, and scalable architecture.