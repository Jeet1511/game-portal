import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
            {/* Sidebar */}
            <Sidebar />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="ml-64 pt-16">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
