import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Public Pages
import Home from './pages/Home';
import Games from './pages/Games';
import GamePlayer from './pages/GamePlayer';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import GameList from './pages/admin/Games/GameList';
import AddGame from './pages/admin/Games/AddGame';
import UserList from './pages/admin/Users/UserList';
import Leaderboards from './pages/admin/Leaderboards';
import Analytics from './pages/admin/Analytics';

// Admin Layout Component
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/game/:id" element={<GamePlayer />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="games" element={<GameList />} />
          <Route path="games/add" element={<AddGame />} />
          <Route path="users" element={<UserList />} />
          <Route path="leaderboards" element={<Leaderboards />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
