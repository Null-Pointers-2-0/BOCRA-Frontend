# BOCRA Portal - Backend Preparation Documentation

## Overview
This document outlines the backend API requirements and data structures needed to support the BOCRA Regulatory Portal frontend implementation.

## 🏗️ Architecture Overview

### Frontend Structure
- **Portal Layout**: Shared layout with sidebar navigation
- **Pages**: Dashboard, Applications, Licenses, Complaints, Profile, Notifications
- **Components**: Reusable UI components with dark mode support
- **Theme System**: Context-based dark/light mode switching

### Backend Requirements
- **Authentication**: JWT-based user authentication
- **RESTful APIs**: Standard REST endpoints for all operations
- **Database**: PostgreSQL or MongoDB for data persistence
- **File Storage**: For license documents and application uploads

## 📊 Database Schema Requirements

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  role ENUM('business_user', 'individual', 'admin') DEFAULT 'business_user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Applications Table
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  application_type ENUM('telecommunications', 'broadcasting', 'postal', 'internet') NOT NULL,
  license_type VARCHAR(100) NOT NULL,
  status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_action') DEFAULT 'draft',
  submission_date TIMESTAMP,
  review_date TIMESTAMP,
  approval_date TIMESTAMP,
  rejection_reason TEXT,
  assigned_reviewer_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Application Documents Table
```sql
CREATE TABLE application_documents (
  id UUID PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Licenses Table
```sql
CREATE TABLE licenses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  application_id UUID REFERENCES applications(id),
  license_number VARCHAR(100) UNIQUE NOT NULL,
  license_type VARCHAR(100) NOT NULL,
  status ENUM('active', 'expired', 'suspended', 'revoked') DEFAULT 'active',
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  renewal_date DATE,
  terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Complaints Table
```sql
CREATE TABLE complaints (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  complaint_type VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('submitted', 'under_review', 'resolved', 'rejected') DEFAULT 'submitted',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  assigned_agent_id UUID REFERENCES users(id),
  resolution_text TEXT,
  submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_date TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
POST /api/auth/refresh
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Applications Endpoints
```
GET    /api/applications              # List user applications
POST   /api/applications              # Create new application
GET    /api/applications/:id          # Get application details
PUT    /api/applications/:id          # Update application
DELETE /api/applications/:id          # Delete application
POST   /api/applications/:id/submit   # Submit application for review
GET    /api/applications/:id/documents # Get application documents
POST   /api/applications/:id/documents # Upload document
DELETE /api/applications/documents/:id # Delete document
```

### Licenses Endpoints
```
GET /api/licenses                    # List user licenses
GET /api/licenses/:id                # Get license details
GET /api/licenses/types              # Get available license types
POST /api/licenses/:id/renew         # Renew license
GET /api/licenses/:id/documents      # Get license documents
```

### Complaints Endpoints
```
GET    /api/complaints               # List user complaints
POST   /api/complaints               # Create new complaint
GET    /api/complaints/:id           # Get complaint details
PUT    /api/complaints/:id           # Update complaint
DELETE /api/complaints/:id           # Delete complaint
```

### Notifications Endpoints
```
GET    /api/notifications            # List user notifications
PUT    /api/notifications/:id/read   # Mark notification as read
PUT    /api/notifications/read-all   # Mark all notifications as read
DELETE /api/notifications/:id        # Delete notification
GET    /api/notifications/unread-count # Get unread count
```

## 📋 API Response Formats

### Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-03-25T10:30:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {}
  },
  "timestamp": "2024-03-25T10:30:00Z"
}
```

### Application Response Example
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "application_type": "telecommunications",
    "license_type": "Aircraft Radio License",
    "status": "under_review",
    "submission_date": "2024-03-25T10:30:00Z",
    "documents": [
      {
        "id": "uuid",
        "document_type": "business_registration",
        "file_name": "registration.pdf",
        "file_size": 1024000,
        "uploaded_at": "2024-03-25T10:30:00Z"
      }
    ]
  }
}
```

## 🔐 Security Requirements

### Authentication
- JWT tokens with 24-hour expiration
- Refresh tokens for extended sessions
- Password hashing with bcrypt
- Rate limiting on auth endpoints

### Authorization
- Role-based access control (RBAC)
- User can only access their own data
- Admin users can access all data
- API key authentication for system integrations

### Data Protection
- HTTPS enforcement
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 📁 File Upload Requirements

### Supported File Types
- PDF: Application forms, certificates
- DOC/DOCX: Supporting documents
- JPG/PNG: Identity documents, photos
- ZIP: Multiple document uploads

### File Size Limits
- Maximum file size: 10MB per file
- Maximum total per application: 50MB
- Automatic virus scanning
- File type validation

### Storage Structure
```
uploads/
├── applications/
│   ├── {user_id}/
│   │   ├── {application_id}/
│   │   │   ├── documents/
│   │   │   └── certificates/
├── licenses/
│   ├── {user_id}/
│   │   └── {license_id}/
└── profiles/
    └── {user_id}/
```

## 🔄 Integration Points

### Email Service
- Application submission confirmations
- Status update notifications
- License expiry reminders
- Password reset emails

### Payment Gateway
- Application fee processing
- License renewal payments
- Receipt generation
- Refund processing

### External APIs
- Company registration validation
- Identity verification services
- Document authentication
- License number generation

## 📊 Monitoring & Logging

### Required Logs
- User authentication attempts
- API access logs
- File upload/download activities
- Error logs with stack traces
- Performance metrics

### Monitoring Metrics
- Response times per endpoint
- Error rates by endpoint
- Database query performance
- File storage usage
- Active user sessions

## 🚀 Deployment Considerations

### Environment Variables
```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
FILE_STORAGE_PATH=
EMAIL_SERVICE_API_KEY=
PAYMENT_GATEWAY_KEY>
```

### Database Migrations
- Version-controlled schema changes
- Rollback capabilities
- Data migration scripts
- Backup procedures

### Scaling Requirements
- Load balancing for API servers
- Database read replicas
- CDN for file uploads
- Caching layer (Redis)

## 🧪 Testing Requirements

### Unit Tests
- Business logic validation
- Data transformation functions
- Utility functions

### Integration Tests
- API endpoint testing
- Database operations
- File upload/download

### End-to-End Tests
- User registration flow
- Application submission process
- License renewal workflow
- Complaint submission process

## 📝 Next Steps

1. **Database Setup**: Create database schema and migrations
2. **API Development**: Implement REST endpoints following the specifications
3. **Authentication**: Implement JWT-based authentication system
4. **File Storage**: Set up file upload and storage system
5. **Integration**: Connect frontend to backend APIs
6. **Testing**: Implement comprehensive testing suite
7. **Deployment**: Deploy to staging and production environments

---

**Note**: This documentation should be used as a guide for backend development. The frontend is already implemented and ready to integrate with these APIs.
