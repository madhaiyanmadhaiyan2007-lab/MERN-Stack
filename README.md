# 📚 BookTrade - MERN Book Trading Platform

A full-stack web application that allows users to trade books with each other. Built with MongoDB, Express.js, React, and Node.js.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Book Management**: Create, edit, and delete book listings with cover images
- **Trade System**: Request trades, accept/reject offers, and confirm completions
- **Real-time Messaging**: Chat with trade partners about book exchanges
- **Search & Filter**: Find books by title, author, genre, or condition
- **Admin Panel**: Monitor users, view statistics, and manage reports
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Material UI, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Docker, Docker Compose |

## Project Structure

```
website/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & error handling
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── server.js       # Express app
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Page components
│   │   └── services/   # API calls
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

1. **Clone and install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Open http://localhost:5173**

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile

### Books
- `GET /api/books` - List all books
- `GET /api/books/search` - Search books
- `POST /api/books` - Create book (auth)
- `PUT /api/books/:id` - Update book (auth)
- `DELETE /api/books/:id` - Delete book (auth)

### Trades
- `GET /api/trades` - Get user trades (auth)
- `POST /api/trades` - Create trade request (auth)
- `PUT /api/trades/:id` - Accept/reject trade (auth)

### Messages
- `GET /api/messages/:tradeId` - Get trade messages (auth)
- `POST /api/messages` - Send message (auth)

### Admin
- `GET /api/admin/stats` - Platform statistics (admin)
- `GET /api/admin/users` - List users (admin)
- `GET /api/admin/reports` - View reports (admin)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRE` | Token expiration (default: 30d) |
| `FRONTEND_URL` | Frontend URL for CORS |

## License

MIT License - feel free to use for personal or commercial projects.
