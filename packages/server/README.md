# Game Portal - Backend Server

Production-ready Express API server for the Game Portal platform.

## Features

- ✅ Discord OAuth 2.0 authentication
- ✅ JWT token-based sessions
- ✅ MongoDB with Mongoose ODM
- ✅ Rate limiting & security
- ✅ Error handling & logging
- ✅ TypeScript support
- ✅ RESTful API design

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

See `.env.example` for all required variables.

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `DISCORD_CLIENT_ID` - Discord OAuth client ID
- `DISCORD_CLIENT_SECRET` - Discord OAuth client secret

## API Endpoints

### Authentication
- `GET /api/auth/discord` - Redirect to Discord OAuth
- `POST /api/auth/callback` - Handle OAuth callback
- `GET /api/auth/me` - Get current user (auth required)
- `POST /api/auth/logout` - Logout user

### Games
- `GET /api/games` - List all active games
- `GET /api/games/:slug` - Get game by slug

### Scores
- `POST /api/scores/submit` - Submit score (auth required)
- `GET /api/scores/leaderboard/:gameSlug` - Get leaderboard

### Health
- `GET /health` - Server health check

## Project Structure

```
src/
├── config/          # Configuration
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── middleware/      # Express middleware
├── utils/           # Utilities
├── app.ts           # Express app
└── index.ts         # Server entry point
```

## Development

```bash
# Run with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

The server is designed to be deployed on platforms like:
- Railway
- Render
- Fly.io
- Heroku

Make sure to set all environment variables in your deployment platform.

## License

MIT
