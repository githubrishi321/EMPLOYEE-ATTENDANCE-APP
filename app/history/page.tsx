'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AttendanceCalendar } from '@/components/history/AttendanceCalendar';
import { useAttendance } from '@/contexts/AttendanceContext';
import { formatTime, formatDate } from '@/lib/utils';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AttendanceHistoryPage() {
    const { employee, attendanceHistory, fetchEmployee, fetchAttendanceHistory } = useAttendance();
    const [selectedMonth, setSelectedMonth] = useState('');

    const DEMO_EMPLOYEE_ID = process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_ID || 'demo_employee_123';

    useEffect(() => {
        fetchEmployee(DEMO_EMPLOYEE_ID);

        // Set current month
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        setSelectedMonth(month);

        // Fetch history for current month
        fetchAttendanceHistory(DEMO_EMPLOYEE_ID, month);
    }, []);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = e.target.value;
        setSelectedMonth(month);
        fetchAttendanceHistory(DEMO_EMPLOYEE_ID, month);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Present':
                return <CheckCircle className="text-[#16A34A]" size={20} />;
            case 'Late':
                return <AlertCircle className="text-[#F59E0B]" size={20} />;
            case 'Absent':
                return <XCircle className="text-[#DC2626]" size={20} />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            Present: 'bg-[#16A34A] text-white',
            Late: 'bg-[#F59E0B] text-white',
            Absent: 'bg-[#DC2626] text-white',
        };

        return (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    // Generate month options (last 6 months)
    const monthOptions = [];
    for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthOptions.push({ value, label });
    }

    return (
        <AppLayout
            employeeName={employee?.name || 'Employee'}
            employeeRole={employee?.role || 'Employee'}
        >
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B]">Attendance History</h1>
                        <p className="text-gray-600 mt-1">View your past attendance records</p>
                    </div>

                    {/* Month Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar className="text-gray-400" size={20} />
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                            {monthOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Total Days</p>
                                <p className="text-3xl font-bold text-[#2563EB]">{attendanceHistory.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Present</p>
                                <p className="text-3xl font-bold text-[#16A34A]">
                                    {attendanceHistory.filter((a) => a.status === 'Present').length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Late</p>
                                <p className="text-3xl font-bold text-[#F59E0B]">
                                    {attendanceHistory.filter((a) => a.status === 'Late').length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Avg Hours</p>
                                <p className="text-3xl font-bold text-[#2563EB]">
                                    {attendanceHistory.length > 0
                                        ? (
                                            attendanceHistory.reduce((sum, a) => sum + a.workingHours, 0) /
                                            attendanceHistory.length
                                        ).toFixed(1)
                                        : '0'}
                                    h
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar View */}
                <AttendanceCalendar 
                    attendanceHistory={attendanceHistory} 
                    selectedMonth={selectedMonth}
                />

                {/* Attendance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {attendanceHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Records Found</h3>
                                <p className="text-gray-500">No attendance records for the selected month</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <table className="w-full min-w-[640px]">
                                    <thead>
                                        <tr className="border-b border-[#E2E8F0]">
                                            <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm">Date</th>
                                            <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm">Check-In</th>
                                            <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm">Check-Out</th>
                                            <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm">Hours</th>
                                            <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm">Status</th>
                                            <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 text-sm">Photo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceHistory.map((record) => (
                                            <tr
                                                key={record._id}
                                                className="border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(record.status)}
                                                        <span className="font-medium text-sm md:text-base">
                                                            {new Date(record.date).toLocaleDateString('en-US', {
                                                                weekday: 'short',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-gray-400 hidden sm:block" />
                                                        <span className="text-sm md:text-base">{formatTime(new Date(record.checkIn))}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                    {record.checkOut ? (
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={14} className="text-gray-400 hidden sm:block" />
                                                            <span className="text-sm md:text-base">{formatTime(new Date(record.checkOut))}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs md:text-sm">Not checked out</span>
                                                    )}
                                                </td>
                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                    <span className="font-semibold text-[#2563EB] text-sm md:text-base">
                                                        {record.workingHours.toFixed(2)}h
                                                    </span>
                                                </td>
                                                <td className="py-3 md:py-4 px-2 md:px-4">{getStatusBadge(record.status)}</td>
                                                <td className="py-3 md:py-4 px-2 md:px-4">
                                                    {record.attendancePhoto && (
                                                        <img
                                                            src={record.attendancePhoto}
                                                            alt="Attendance"
                                                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover border border-[#E2E8F0] cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={() => window.open(record.attendancePhoto, '_blank')}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
