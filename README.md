# 🎮 Game Portal

A production-ready web platform for HTML5 games with Discord bot integration, admin dashboard, and real-time features.

## Features

- 🎮 Play HTML5 games directly in browser
- 🔐 Discord OAuth authentication
- 📊 Real-time leaderboards
- 👑 Admin dashboard for game management
- 🏆 Achievement system
- 📱 Mobile-friendly responsive design
- ⚡ Real-time updates with WebSockets

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand for state management
- Vite for blazing fast builds

### Backend
- Node.js 20 + Express + TypeScript
- MongoDB Atlas
- Redis caching
- Socket.io for real-time features

### DevOps
- Docker + Docker Compose
- GitHub Actions CI/CD
- Vercel (frontend) + Railway (backend)

## Project Structure

```
game-portal/
├── apps/
│   ├── web/          # Public web client
│   ├── admin/        # Admin dashboard
│   └── discord-bot/  # Discord bot (optional)
├── packages/
│   ├── server/       # Backend API
│   ├── shared/       # Shared types/utils
│   └── game-sdk/     # Game integration SDK
├── games/            # HTML5 games
└── infrastructure/   # Docker, K8s configs
```

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- Discord Application (for OAuth)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/game-portal.git
cd game-portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development servers
npm run dev
```

### Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gameportal
REDIS_URL=redis://localhost:6379

# Discord OAuth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRY=7d

# Admin
ADMIN_EMAIL=admin@example.com

# Storage
R2_ACCOUNT_ID=your_r2_account
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
R2_BUCKET=gameportal-assets
```

## Development

```bash
# Start all services
npm run dev

# Start specific app
npm run dev:web      # Web client on :3000
npm run dev:admin    # Admin on :3001
npm run dev:server   # API server on :8080

# Build for production
npm run build

# Run tests
npm run test

# Lint & format
npm run lint
npm run format
```

## Deployment

### Frontend (Vercel)
```bash
cd apps/web
vercel --prod
```

### Backend (Railway)
```bash
cd packages/server
railway up
```

## API Documentation

API docs available at: `http://localhost:8080/api-docs`

### Key Endpoints

```
GET  /api/games              # List games
POST /api/auth/discord       # Discord OAuth
POST /api/scores/submit      # Submit score
GET  /api/leaderboard/:game  # Get leaderboard
```

## Game Integration

Create a new game by implementing the Game API:

```javascript
window.GameAPI = {
  init: (config) => { /* Initialize game */ },
  start: () => { /* Start game */ },
  end: (score, metadata) => { /* Submit score */ }
};
```

See [Game SDK Documentation](./packages/game-sdk/README.md) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- Documentation: [docs.gameportal.com](https://docs.gameportal.com)
- Discord: [Join our server](https://discord.gg/gameportal)
- Issues: [GitHub Issues](https://github.com/yourusername/game-portal/issues)

## Roadmap

- [x] Core game platform
- [x] Discord OAuth
- [x] Leaderboards
- [ ] Multiplayer games
- [ ] Tournament system
- [ ] Mobile app
- [ ] Game marketplace

---

Built with ❤️ by [Your Name]
