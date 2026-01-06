'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { formatTime, formatDate, isWeekend, cn } from '@/lib/utils';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface AttendanceRecord {
    _id: string;
    date: string;
    checkIn: Date | string;
    checkOut?: Date | string;
    workingHours: number;
    status: 'Present' | 'Late' | 'Absent';
    attendancePhoto?: string;
}

interface AttendanceCalendarProps {
    attendanceHistory: AttendanceRecord[];
    selectedMonth: string; // Format: YYYY-MM
}

export function AttendanceCalendar({ attendanceHistory, selectedMonth }: AttendanceCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showDetailDrawer, setShowDetailDrawer] = useState(false);

    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create a map of date -> attendance record
    const attendanceMap = new Map<string, AttendanceRecord>();
    attendanceHistory.forEach(record => {
        attendanceMap.set(record.date, record);
    });

    const handleDateClick = (date: string) => {
        if (attendanceMap.has(date) || isWeekend(new Date(date))) {
            setSelectedDate(date);
            setShowDetailDrawer(true);
        }
    };

    const getDateRecord = (date: string): AttendanceRecord | null => {
        return attendanceMap.get(date) || null;
    };

    const getDateStatus = (date: string): 'Present' | 'Late' | 'Absent' | 'Weekend' | 'None' => {
        if (isWeekend(new Date(date))) {
            return 'Weekend';
        }
        const record = attendanceMap.get(date);
        if (record) {
            return record.status;
        }
        return 'None';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present':
                return 'bg-[#16A34A] text-white';
            case 'Late':
                return 'bg-[#F59E0B] text-white';
            case 'Absent':
                return 'bg-[#DC2626] text-white';
            case 'Weekend':
                return 'bg-gray-200 text-gray-500';
            default:
                return 'bg-white text-gray-400 border border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Present':
                return <CheckCircle className="text-[#16A34A]" size={16} />;
            case 'Late':
                return <AlertCircle className="text-[#F59E0B]" size={16} />;
            case 'Absent':
                return <XCircle className="text-[#DC2626]" size={16} />;
            default:
                return null;
        }
    };

    // Generate calendar days
    const calendarDays = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        calendarDays.push(dateStr);
    }

    const selectedRecord = selectedDate ? getDateRecord(selectedDate) : null;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                        <div className="min-w-[320px] md:min-w-[600px] px-4 md:px-0">
                            {/* Day Names Header */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                                {dayNames.map(day => (
                                    <div
                                        key={day}
                                        className="text-center text-xs md:text-sm font-semibold text-gray-600 py-1 md:py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                                {calendarDays.map((date, index) => {
                                    if (!date) {
                                        return <div key={`empty-${index}`} className="aspect-square" />;
                                    }

                                    const status = getDateStatus(date);
                                    const record = getDateRecord(date);
                                    const isClickable = status !== 'None';

                                    return (
                                        <button
                                            key={date}
                                            onClick={() => isClickable && handleDateClick(date)}
                                            className={cn(
                                                'aspect-square rounded-lg p-1 md:p-2 flex flex-col items-center justify-center',
                                                'transition-all duration-200 text-xs md:text-sm',
                                                getStatusColor(status),
                                                isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : 'cursor-default'
                                            )}
                                        >
                                            <span className="font-medium">{new Date(date).getDate()}</span>
                                            {record && (
                                                <div className="mt-0.5 md:mt-1">
                                                    {getStatusIcon(status)}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#E2E8F0]">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-[#16A34A]"></div>
                            <span className="text-sm text-gray-600">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-[#F59E0B]"></div>
                            <span className="text-sm text-gray-600">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-[#DC2626]"></div>
                            <span className="text-sm text-gray-600">Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-200"></div>
                            <span className="text-sm text-gray-600">Weekend</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Drawer/Modal */}
            <Modal
                isOpen={showDetailDrawer}
                onClose={() => {
                    setShowDetailDrawer(false);
                    setSelectedDate(null);
                }}
                title={selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }) : 'Attendance Details'}
                size="md"
            >
                {selectedRecord ? (
                    <div className="space-y-4">
                        {/* Status Badge */}
                        <div className="flex items-center justify-center">
                            <span
                                className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                                    selectedRecord.status === 'Present'
                                        ? 'bg-[#16A34A] text-white'
                                        : selectedRecord.status === 'Late'
                                        ? 'bg-[#F59E0B] text-white'
                                        : 'bg-[#DC2626] text-white'
                                }`}
                            >
                                {selectedRecord.status}
                            </span>
                        </div>

                        {/* Check-In Time */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Clock className="text-[#2563EB]" size={24} />
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Check-In Time</p>
                                <p className="font-semibold text-[#1E293B]">
                                    {formatTime(new Date(selectedRecord.checkIn))}
                                </p>
                            </div>
                        </div>

                        {/* Check-Out Time */}
                        {selectedRecord.checkOut ? (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Clock className="text-[#F59E0B]" size={24} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Check-Out Time</p>
                                    <p className="font-semibold text-[#1E293B]">
                                        {formatTime(new Date(selectedRecord.checkOut))}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <Clock className="text-gray-400" size={24} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Check-Out Time</p>
                                    <p className="font-semibold text-gray-400">Not checked out</p>
                                </div>
                            </div>
                        )}

                        {/* Working Hours */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            <Calendar className="text-[#16A34A]" size={24} />
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Working Hours</p>
                                <p className="font-semibold text-[#1E293B]">
                                    {selectedRecord.workingHours.toFixed(2)} hours
                                </p>
                            </div>
                        </div>

                        {/* Attendance Photo */}
                        {selectedRecord.attendancePhoto && (
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">Attendance Photo</p>
                                <img
                                    src={selectedRecord.attendancePhoto}
                                    alt="Attendance"
                                    className="w-full rounded-lg border-2 border-[#E2E8F0] cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => window.open(selectedRecord.attendancePhoto, '_blank')}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className="text-gray-600">
                            {isWeekend(new Date(selectedDate || '')) 
                                ? 'This is a weekend' 
                                : 'No attendance record for this date'}
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
}

