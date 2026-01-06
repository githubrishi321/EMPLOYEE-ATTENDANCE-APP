'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface HeaderProps {
    employeeName: string;
    employeeRole: string;
    onMenuClick?: () => void;
}

export function Header({ employeeName, employeeRole, onMenuClick }: HeaderProps) {
    // Hydration-safe: Initialize as null, set only on client
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Set mounted state and initial time only on client
    useEffect(() => {
        setIsMounted(true);
        setCurrentTime(new Date());
    }, []);

    // Update clock every second (only after mount)
    useEffect(() => {
        if (!isMounted) return;

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [isMounted]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    return (
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6 w-full">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} className="text-gray-600" />
                    </button>
                )}
                <h2 className="text-lg md:text-xl font-semibold text-[#1E293B] truncate">
                    <span className="hidden sm:inline">Welcome back, </span>
                    {employeeName}!
                </h2>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
                {/* Live Clock - Hydration-safe */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    {isMounted && currentTime ? (
                        <>
                            <span className="font-mono font-semibold text-[#2563EB]">
                                {formatTime(currentTime)}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span>
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="font-mono font-semibold text-[#2563EB] w-16 h-4 bg-gray-200 rounded animate-pulse"></span>
                            <span className="text-gray-400">|</span>
                            <span className="w-20 h-4 bg-gray-200 rounded animate-pulse"></span>
                        </>
                    )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
                            <User size={18} className="text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-[#1E293B]">{employeeName}</p>
                            <p className="text-xs text-gray-500">{employeeRole}</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-2 animate-fadeIn z-50">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                <User size={16} />
                                <span className="text-sm">Profile</span>
                            </Link>
                            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-[#DC2626]">
                                <LogOut size={16} />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
