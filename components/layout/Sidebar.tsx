'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Camera,
    UserCircle,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Camera, label: 'Mark Attendance', href: '/attendance' },
    { icon: UserCircle, label: 'Photo Registration', href: '/registration' },
    { icon: Calendar, label: 'Attendance History', href: '/history' },
    { icon: Settings, label: 'Profile Settings', href: '/profile' },
];

interface SidebarProps {
    isCollapsed: boolean;
    isMobile?: boolean;
    isMobileMenuOpen?: boolean;
    onToggle: () => void;
    onMobileClose?: () => void;
}

export function Sidebar({
    isCollapsed,
    isMobile = false,
    isMobileMenuOpen = false,
    onToggle,
    onMobileClose,
}: SidebarProps) {
    const pathname = usePathname();

    const handleLinkClick = () => {
        if (isMobile && onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-screen bg-[#1E293B] text-white transition-all duration-300 z-40 overflow-y-auto',
                isMobile
                    ? cn(
                          'transform transition-transform',
                          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                      )
                    : '',
                isMobile ? 'w-64' : isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-[#334155]">
                {!isCollapsed && (
                    <h1 className="text-xl font-bold">Attendance</h1>
                )}
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg hover:bg-[#334155] transition-colors ml-auto"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-3">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-[#2563EB] text-white'
                                            : 'text-gray-300 hover:bg-[#334155] hover:text-white'
                                    )}
                                    title={isCollapsed && !isMobile ? item.label : undefined}
                                >
                                    <Icon size={24} className="flex-shrink-0" />
                                    {(!isCollapsed || isMobile) && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            {(!isCollapsed || isMobile) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#334155]">
                    <p className="text-xs text-gray-400 text-center">
                        © 2026 Employee Attendance
                    </p>
                </div>
            )}
        </aside>
    );
}
