# Design Document

## Overview

The Property Management Core module serves as the foundational layer of the Property Management System (PMS). It implements a hierarchical data model where Properties contain multiple Units, with comprehensive CRUD operations, role-based access control, and document management capabilities. The system follows a modern web architecture using React for the frontend, Node.js/Express for the API layer, and PostgreSQL with Supabase for data persistence and real-time features.

## Architecture

### System Architecture
The system follows a three-tier architecture:

1. **Presentation Layer**: React-based SPA with responsive design
2. **API Layer**: RESTful Node.js/Express server with authentication middleware
3. **Data Layer**: PostgreSQL database hosted on Supabase with Row Level Security (RLS)

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query for state management
- **Backend**: Node.js, Express.js, TypeScript, JWT authentication
- **Database**: PostgreSQL (Supabase), Prisma ORM for type-safe database access
- **File Storage**: Supabase Storage for document and image uploads
- **Authentication**: Supabase Auth with role-based access control

### Data Flow
```
User Action → React Component → API Call → Express Route → Prisma Query → PostgreSQL → Response Chain
```

## Components and Interfaces

### Frontend Components

#### PropertyDashboard Component
- Displays property portfolio overview with statistics
- Integrates PropertyList and PropertyStats components
- Handles property filtering and search functionality

#### PropertyForm Component
- Handles property creation and editing
- Includes form validation and error handling
- Supports document upload integration

#### UnitGrid Component
- Displays units within a property in grid layout
- Shows unit status with color-coded indicators
- Provides quick actions for unit management

#### DocumentManager Component
- Handles file uploads with drag-and-drop interface
- Categorizes documents and displays organized lists
- Implements file preview and download functionality

### Backend API Interfaces

#### Property Controller
```typescript
interface PropertyController {
  createProperty(req: Request, res: Response): Promise<void>
  getProperties(req: Request, res: Response): Promise<void>
  getPropertyById(req: Request, res: Response): Promise<void>
  updateProperty(req: Request, res: Response): Promise<void>
  deleteProperty(req: Request, res: Response): Promise<void>
  getPropertyStats(req: Request, res: Response): Promise<void>
}
```

#### Unit Controller
```typescript
interface UnitController {
  createUnit(req: Request, res: Response): Promise<void>
  getUnitsByProperty(req: Request, res: Response): Promise<void>
  updateUnit(req: Request, res: Response): Promise<void>
  updateUnitStatus(req: Request, res: Response): Promise<void>
}
```

### Service Layer Interfaces

#### PropertyService
```typescript
interface PropertyService {
  createProperty(data: CreatePropertyDTO, userId: string): Promise<Property>
  getPropertiesByManager(managerId: string): Promise<Property[]>
  updateProperty(id: string, data: UpdatePropertyDTO): Promise<Property>
  calculateOccupancyRate(propertyId: string): Promise<number>
}
```

## Data Models

### Core Entities

#### Property Entity
```typescript
interface Property {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL'
  totalUnits: number
  description?: string
  createdAt: Date
  updatedAt: Date
  managerId: string
  units: Unit[]
  documents: PropertyDocument[]
}
```

#### Unit Entity
```typescript
interface Unit {
  id: string
  propertyId: string
  unitNumber: string
  unitType: 'STUDIO' | '1BR' | '2BR' | '3BR' | '4BR' | 'COMMERCIAL'
  rentAmount: number
  squareFootage?: number
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED'
  description?: string
  createdAt: Date
  updatedAt: Date
  property: Property
  currentTenantId?: string
}
```

#### PropertyDocument Entity
```typescript
interface PropertyDocument {
  id: string
  propertyId: string
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  category: 'LEGAL' | 'PHOTOS' | 'MAINTENANCE' | 'OTHER'
  uploadedAt: Date
  uploadedBy: string
  storageUrl: string
}
```

### Database Schema Design

#### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20),
  property_type property_type_enum NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  manager_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Units Table
```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number VARCHAR(50) NOT NULL,
  unit_type unit_type_enum NOT NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  square_footage INTEGER,
  status unit_status_enum NOT NULL DEFAULT 'AVAILABLE',
  description TEXT,
  current_tenant_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, unit_number)
);
```

## Error Handling

### API Error Response Format
```typescript
interface APIError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}
```

### Error Categories
1. **Validation Errors**: Invalid input data (400 Bad Request)
2. **Authentication Errors**: Invalid or missing tokens (401 Unauthorized)
3. **Authorization Errors**: Insufficient permissions (403 Forbidden)
4. **Resource Errors**: Property/Unit not found (404 Not Found)
5. **Conflict Errors**: Duplicate unit numbers (409 Conflict)
6. **Server Errors**: Database or system failures (500 Internal Server Error)

### Frontend Error Handling
- Global error boundary for React component errors
- Toast notifications for user-facing errors
- Form validation with real-time feedback
- Retry mechanisms for network failures

### Backend Error Handling
- Centralized error middleware for consistent responses
- Input validation using Joi or Zod schemas
- Database constraint error mapping
- Logging integration for error tracking

## Testing Strategy

### Unit Testing
- **Frontend**: Jest + React Testing Library for component testing
- **Backend**: Jest + Supertest for API endpoint testing
- **Database**: In-memory SQLite for isolated unit tests
- **Coverage Target**: 80% code coverage minimum

### Integration Testing
- API integration tests with test database
- Database migration and rollback testing
- File upload and storage integration tests
- Authentication and authorization flow testing

### End-to-End Testing
- Cypress for critical user journeys
- Property creation and management workflows
- Unit management and status updates
- Document upload and management flows

### Performance Testing
- Load testing for concurrent property operations
- Database query performance optimization
- File upload performance with large documents
- API response time monitoring

### Security Testing
- SQL injection prevention testing
- File upload security validation
- Authentication bypass attempt testing
- Role-based access control verification

## Implementation Considerations

### Database Optimization
- Indexes on frequently queried fields (manager_id, property_id)
- Composite indexes for property-unit relationships
- Database connection pooling for performance
- Query optimization for dashboard statistics

### File Storage Strategy
- Supabase Storage buckets organized by property
- File size limits and type validation
- Image optimization for property photos
- Document versioning for legal files

### Caching Strategy
- Redis caching for property statistics
- Browser caching for static assets
- API response caching for read-heavy operations
- Real-time cache invalidation on updates

### Security Measures
- Row Level Security (RLS) policies in Supabase
- JWT token validation and refresh
- File upload virus scanning
- Input sanitization and validation
- HTTPS enforcement for all communications