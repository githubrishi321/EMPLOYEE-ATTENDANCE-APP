'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';

interface AppLayoutProps {
    children: React.ReactNode;
    employeeName?: string;
    employeeRole?: string;
}

export function AppLayout({
    children,
    employeeName = 'Employee',
    employeeRole = 'Employee',
}: AppLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSidebarToggle = () => {
        if (isMobile) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                isMobile={isMobile}
                isMobileMenuOpen={isMobileMenuOpen}
                onToggle={handleSidebarToggle}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Overlay */}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div
                className={`transition-all duration-300 relative ${
                    isMobile
                        ? 'ml-0'
                        : isSidebarCollapsed
                        ? 'ml-20'
                        : 'ml-64'
                }`}
            >
                {/* Header - Fixed at top, positioned relative to main content */}
                <div
                    className={`fixed top-0 right-0 z-30 transition-all duration-300 ${
                        isMobile
                            ? 'left-0'
                            : isSidebarCollapsed
                            ? 'left-20'
                            : 'left-64'
                    }`}
                >
                    <Header
                        employeeName={employeeName}
                        employeeRole={employeeRole}
                        onMenuClick={isMobile ? handleSidebarToggle : undefined}
                    />
                </div>

                {/* Page Content - Accounts for fixed header height (h-16 = 4rem = 64px) */}
                <main className="pt-16 p-4 md:p-6 min-h-screen">
                    {children}
                </main>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}
