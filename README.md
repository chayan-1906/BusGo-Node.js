# 🚀 BusGo Node.js Backend

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.15.2-47A248.svg)](https://www.mongodb.com/)
[![AdminJS](https://img.shields.io/badge/AdminJS-6.8.7-5A67D8.svg)](https://adminjs.co/)

> Robust Node.js backend for BusGo bus booking application featuring Google OAuth, ticketing logic, secure JWT authentication, and AdminJS dashboard for data management.

![logo](https://raw.githubusercontent.com/chayan-1906/Busgo-React-Native/expo-prebuild/assets/images/logo_t.png)

## ✨ Features

- 🔐 **Google OAuth 2.0** - Secure authentication with JWT tokens
- 🎟️ **Ticketing System** - Complete booking and ticket management
- 🗄️ **MongoDB Integration** - Mongoose ODM with optimized queries
- 🧑‍💼 **AdminJS Dashboard** - Admin panel for data management
- ⚡ **Performance** - Optimized queries with proper indexing
- 🔄 **Token Management** - Access & refresh token handling
- 🌐 **CORS Enabled** - Cross-origin resource sharing
- 🛡️ **Type Safety** - Full TypeScript implementation
- 🎯 **Error Handling** - Standardized API responses

## 🌐 Live API

**Production URL:** `https://busgo-node-js.onrender.com`

## 📚 API Documentation

### Base URL
```
https://busgo-node-js.onrender.com/api/v1
```

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/user/login` | Google OAuth authentication | ❌ |
| `POST` | `/user/refresh-token` | Refresh access token | ❌ |
| `GET` | `/city` | Get all cities | ❌ |
| `GET` | `/bus?busId={busExternalId}` | Get bus details by ID | ❌ |
| `GET` | `/bus/search?from={from}&to={to}&date={date}&tags={tags}&sortBy={sortBy}` | Search buses | ❌ |
| `GET` | `/ticket` | Get user tickets | ✅ |
| `POST` | `/ticket` | Book new ticket | ✅ |
| `POST` | `/seed` | Seed database | ❌ |

### Admin Dashboard
```
https://busgo-node-js.onrender.com/admin
```

## 🔧 Tech Stack

### Core Technologies
- **Node.js** 18+ - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **TypeScript** 4.9.5 - Type safety
- **MongoDB** - Database with Mongoose ODM

### Authentication & Security
- **Google Auth Library** 10.1.0 - OAuth 2.0 integration
- **JSON Web Token** 9.0.2 - JWT authentication
- **Express Session** 1.18.1 - Session management
- **CORS** 2.8.5 - Cross-origin requests

### Admin & Utilities
- **AdminJS** 6.8.7 - Admin dashboard
- **Colors** 1.4.0 - Console logging
- **Nanoid** 5.1.5 - ID generation
- **UUID** 11.1.0 - Unique identifiers

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Google OAuth credentials

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/chayan-1906/BusGo-Node.js.git
   cd BusGo-Node.js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment**
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/busgo
   WEB_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=30d
   COOKIE_PASSWORD=your_cookie_password
   SEED_SECRET=your_seed_secret
   ADMIN_LOGIN_EMAIL=admin@busgo.com
   ADMIN_LOGIN_PASSWORD=your_admin_password
   ```

5. **Seed database**
   ```bash
   npm run seed:data
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── config/          # Database & app configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication middleware
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── seedData.ts      # Database seeding data
├── seedScript.ts    # Seeding script
└── server.ts        # Application entry point
```

## 📊 Database Schema

### User Schema
```typescript
{
  userExternalId: string    // UUID
  googleId: string         // Google OAuth ID
  email: string           // User email
  name: string            // Display name
  profilePicture: string  // Avatar URL
}
```

### Bus Schema
```typescript
{
  busExternalId: string    // UUID
  from: string            // Origin city
  to: string              // Destination city
  departureTime: Date     // Departure time
  arrivalTime: Date       // Arrival time
  duration: number        // Trip duration (minutes)
  availableSeats: number  // Available seats
  price: number           // Ticket price
  originalPrice: number   // Original price
  company: string         // Bus operator
  busTags: string[]       // Bus amenities
  rating: number          // User rating
  totalReviews: number    // Review count
  badges: string[]        // Quality badges
  seats: ISeat[][]        // Seat layout
}
```

### Ticket Schema
```typescript
{
  ticketExternalId: string  // UUID
  userId: ObjectId         // User reference
  userExternalId: string   // User UUID
  busId: ObjectId          // Bus reference
  busExternalId: string    // Bus UUID
  date: Date               // Travel date
  seatNumbers: number[]    // Selected seats
  totalFare: number        // Total amount
  status: enum             // Upcoming/Completed/Cancelled
  bookedAt: Date           // Booking timestamp
  pnr: string              // PNR number
}
```

## 🔗 API Usage Examples

### Authentication
```bash
curl -X POST https://busgo-node-js.onrender.com/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"idToken": "google_id_token"}'
```

### Search Buses
```bash
curl "https://busgo-node-js.onrender.com/api/v1/bus/search?from=Mumbai&to=Pune&date=2025-07-15&tags=A/C,Luxury&sortBy=price"
```

### Get Bus Details
```bash
curl "https://busgo-node-js.onrender.com/api/v1/bus?busId=BUS_12345"
```

### Book Ticket
```bash
curl -X POST https://busgo-node-js.onrender.com/api/v1/ticket \
  -H "Authorization: Bearer your_access_token" \
  -H "Content-Type: application/json" \
  -d '{"busExternalId": "BUS_12345", "seatNumbers": [1,2], "date": "2025-07-15"}'
```

## 🔒 Authentication Flow

1. **Google OAuth Login** - Frontend sends Google ID token
2. **Token Verification** - Backend verifies with Google
3. **User Creation** - New users auto-created
4. **JWT Generation** - Access & refresh tokens issued
5. **Protected Routes** - Bearer token required

## 🧑‍💼 Admin Dashboard

Access AdminJS dashboard for data management:
- **URL:** `https://busgo-node-js.onrender.com/admin`
- **Features:** CRUD operations, user management, analytics
- **Authentication:** Admin credentials required

## 📈 Performance Features

- **Database Indexing** - Optimized queries
- **Connection Pooling** - MongoDB connection optimization
- **Error Handling** - Standardized responses
- **Logging** - Colored console output

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Seed database
npm run seed:data

# Build production
npm run build
```

## 🚀 Deployment

### Render Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 🧪 Testing

```bash
# API Testing with curl
curl -X GET https://busgo-node-js.onrender.com/api/v1/city

# Health Check
curl https://busgo-node-js.onrender.com/admin
```

## 📋 Requirements

- **Node.js:** ≥18.0.0
- **MongoDB:** ≥5.0
- **Memory:** 512MB RAM minimum
- **Storage:** 1GB disk space

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🐛 Known Issues

- Cold starts on the Render free tier may cause delays

## 👨‍💻 Author

**Padmanabha Das**

- GitHub: [@chayan-1906](https://github.com/chayan-1906)
- LinkedIn: [Padmanabha Das](https://www.linkedin.com/in/padmanabha-das-59bb2019b/)
- Email: padmanabhadas9647@gmail.com

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📱 Related Projects

- **Mobile App:** [BusGo React Native](https://github.com/chayan-1906/Busgo-React-Native)

---

<div align="center">
  <p>Made with ❤️ by Padmanabha Das</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
