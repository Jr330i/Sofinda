# Property Management System

A comprehensive property management system built with React, TypeScript, Node.js, and Supabase.

## Project Structure

```
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js Express API
├── .kiro/            # Kiro specifications and configuration
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Supabase account (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup)

### Quick Start with Docker

1. **Clone the repository**

2. **Set up Supabase** (detailed guide: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)):
   ```bash
   cp .env.docker .env
   # Edit .env with your Supabase credentials
   ```

3. **Validate your setup:**
   ```bash
   ./scripts/validate-setup.sh
   ```

4. **Setup database schema:**
   ```bash
   ./scripts/setup-supabase-db.sh
   ```

5. **Start the application:**
   ```bash
   ./scripts/docker-setup.sh
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Development with Docker

For development with hot reloading:

```bash
./scripts/docker-dev.sh
```

### Manual Installation (without Docker)

#### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Supabase account

#### Steps
1. Clone the repository
2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Fill in your Supabase credentials

3. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. Set up the database:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

5. Start the development servers:
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm run dev
   ```

## Features

- Property management with CRUD operations
- Unit management within properties
- Document upload and management
- User authentication and authorization
- Responsive design with Tailwind CSS
- Real-time updates with Supabase

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- TanStack Query for state management
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- Supabase for database and auth
- JWT for authentication

## Development

### Docker Commands

```bash
# Start production environment
docker-compose up -d

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build --no-cache

# Run database migrations
docker-compose exec backend npx prisma db push
```

### Running Tests

```bash
# With Docker
docker-compose exec backend npm test
docker-compose exec frontend npm test

# Without Docker
cd backend && npm test
cd frontend && npm test
```

### Building for Production

```bash
# With Docker
docker-compose build

# Without Docker
cd backend && npm run build
cd frontend && npm run build
```

## License

This project is licensed under the MIT License.