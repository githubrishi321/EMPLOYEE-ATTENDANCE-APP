'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IEmployee } from '@/models/Employee';
import { IAttendance } from '@/models/Attendance';

interface AttendanceContextType {
    employee: IEmployee | null;
    todayAttendance: IAttendance | null;
    attendanceHistory: IAttendance[];
    isLoading: boolean;
    error: string | null;
    fetchEmployee: (id: string) => Promise<void>;
    fetchTodayAttendance: (employeeId: string) => Promise<void>;
    fetchAttendanceHistory: (employeeId: string, month?: string) => Promise<void>;
    markAttendance: (employeeId: string, photo: string) => Promise<{ success: boolean; data?: any; error?: string; confidence?: number }>;
    markCheckout: (employeeId: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    registerPhotos: (employeeId: string, photos: string[]) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: ReactNode }) {
    const [employee, setEmployee] = useState<IEmployee | null>(null);
    const [todayAttendance, setTodayAttendance] = useState<IAttendance | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<IAttendance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch employee profile
    const fetchEmployee = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/employee?id=${id}`);
            const result = await response.json();

            if (result.success) {
                setEmployee(result.data);
                localStorage.setItem('employee', JSON.stringify(result.data));
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to fetch employee profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch today's attendance
    const fetchTodayAttendance = async (employeeId: string) => {
        try {
            const response = await fetch(`/api/attendance/today?employeeId=${employeeId}`);
            const result = await response.json();

            if (result.success) {
                setTodayAttendance(result.data);
                localStorage.setItem('todayAttendance', JSON.stringify(result.data));
            }
        } catch (err) {
            console.error('Failed to fetch today\'s attendance:', err);
        }
    };

    // Fetch attendance history
    const fetchAttendanceHistory = async (employeeId: string, month?: string) => {
        try {
            setIsLoading(true);

            let url = `/api/attendance/history?employeeId=${employeeId}&limit=100`;
            if (month) {
                url += `&month=${month}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                setAttendanceHistory(result.data.records);
            }
        } catch (err) {
            console.error('Failed to fetch attendance history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Mark attendance
    const markAttendance = async (employeeId: string, photo: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, photo }),
            });

            const result = await response.json();

            if (result.success) {
                setTodayAttendance(result.data);
                localStorage.setItem('todayAttendance', JSON.stringify(result.data));
            } else {
                setError(result.error || 'Failed to mark attendance');
            }

            return result;
        } catch (err) {
            const errorMessage = 'Failed to mark attendance. Please check your connection.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Mark checkout
    const markCheckout = async (employeeId: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/attendance/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId }),
            });

            const result = await response.json();

            if (result.success && todayAttendance) {
                const updated = {
                    ...todayAttendance,
                    checkOut: result.data.checkOut,
                    workingHours: result.data.workingHours,
                };
                setTodayAttendance(updated);
                localStorage.setItem('todayAttendance', JSON.stringify(updated));
            } else {
                setError(result.error || 'Failed to mark checkout');
            }

            return result;
        } catch (err) {
            const errorMessage = 'Failed to mark checkout. Please check your connection.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Register photos
    const registerPhotos = async (employeeId: string, photos: string[]) => {
        try {
            setIsLoading(true);
            setError(null);

            // Validate photos before sending
            if (!photos || photos.length === 0) {
                const errorMessage = 'No photos provided';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            if (photos.length < 3 || photos.length > 5) {
                const errorMessage = 'Please provide 3-5 photos';
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            const response = await fetch('/api/employee/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, photos }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                const errorMessage = errorData.error || `Server error (${response.status})`;
                setError(errorMessage);
                return { success: false, error: errorMessage };
            }

            const result = await response.json();

            if (result.success && employee) {
                const updated = { ...employee, faceImages: result.data.faceImages };
                setEmployee(updated);
                localStorage.setItem('employee', JSON.stringify(updated));
            } else {
                const errorMessage = result.error || 'Failed to register photos';
                setError(errorMessage);
            }

            return result;
        } catch (err: any) {
            console.error('Register photos error:', err);
            const errorMessage = err.message || 'Failed to register photos. Please check your connection and try again.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Load from localStorage on mount
    useEffect(() => {
        const savedEmployee = localStorage.getItem('employee');
        const savedAttendance = localStorage.getItem('todayAttendance');

        if (savedEmployee) {
            setEmployee(JSON.parse(savedEmployee));
        }

        if (savedAttendance) {
            setTodayAttendance(JSON.parse(savedAttendance));
        }
    }, []);

    const value = {
        employee,
        todayAttendance,
        attendanceHistory,
        isLoading,
        error,
        fetchEmployee,
        fetchTodayAttendance,
        fetchAttendanceHistory,
        markAttendance,
        markCheckout,
        registerPhotos,
    };

    return (
        <AttendanceContext.Provider value={value}>
            {children}
        </AttendanceContext.Provider>
    );
}

export function useAttendance() {
    const context = useContext(AttendanceContext);
    if (context === undefined) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
}
