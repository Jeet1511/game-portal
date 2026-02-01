# Game Portal Admin Panel

A premium, production-ready admin panel for managing the Game Portal platform.

## Features

- Modern, responsive UI with dark mode
- Role-based access control
- Real-time updates
- Gaming-specific management tools
- Analytics dashboard
- User and game management

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast builds
- **TailwindCSS** for styling
- **lucide-react** for icons
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The admin panel will be available at `http://localhost:3001`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── dashboard/      # Dashboard-specific components
│   └── common/         # Common UI components
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── ...
├── store/              # Zustand stores
│   └── authStore.ts
├── utils/              # Utility functions
│   └── api.ts
└── App.tsx             # Main app component
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

## Default Credentials

For development, use:
- **Email**: admin@gameportal.com
- **Password**: admin123

## Features Roadmap

### Phase 1: Core Features (Current)
- [x] Authentication
- [x] Dashboard
- [ ] User Management
- [ ] Game Management

### Phase 2: Gaming Features
- [ ] Leaderboards
- [ ] Achievements
- [ ] Tournaments
- [ ] Analytics

### Phase 3: Advanced Features
- [ ] Real-time updates
- [ ] Face recognition
- [ ] Server management
- [ ] Contribution tracking

## Development Guide

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Adding New Features

1. Create necessary components in `src/components/`
2. Add API calls in `src/utils/api.ts`
3. Create Zustand store if needed in `src/store/`

## Contributing

This admin panel is designed to be easily extensible. Follow the existing patterns when adding new features.

## License

MIT
