import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Public Pages
import PublicHome from './pages/PublicHome';
import PublicGames from './pages/PublicGames';
import GamePlayer from './pages/GamePlayer';

// Admin Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/layout/AdminLayout';
import GameList from './pages/Games/GameList';
import AddGame from './pages/Games/AddGame';
import UploadGameZip from './pages/Games/UploadGameZip';
import UserList from './pages/Users/UserList';
import Leaderboards from './pages/Leaderboards';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DevCenter from './pages/DevCenter';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/games" element={<PublicGames />} />
      <Route path="/play/:id" element={<GamePlayer />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Games */}
                <Route path="/games" element={<GameList />} />
                <Route path="/games/new" element={<AddGame />} />
                <Route path="/games/upload-zip" element={<UploadGameZip />} />

                {/* Users */}
                <Route path="/users" element={<UserList />} />
                <Route path="/users/banned" element={<UserList />} />

                {/* Leaderboards */}
                <Route path="/leaderboards" element={<Leaderboards />} />

                {/* Analytics */}
                <Route path="/analytics" element={<Analytics />} />

                {/* Dev Center */}
                <Route path="/dev-center" element={<DevCenter />} />

                {/* Settings */}
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
