import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
            {/* Sidebar */}
            <Sidebar />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="ml-64 pt-16">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
