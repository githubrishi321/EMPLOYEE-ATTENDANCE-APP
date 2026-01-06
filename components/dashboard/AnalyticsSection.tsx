'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsSectionProps {
    attendanceHistory?: Array<{
        date: string;
        status: 'Present' | 'Late' | 'Absent';
        workingHours: number;
    }>;
}

export function AnalyticsSection({ attendanceHistory }: AnalyticsSectionProps) {
    // Get last 7 days of attendance
    const getLast7Days = () => {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const attendance = attendanceHistory?.find(a => a.date === dateStr);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            
            days.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: dateStr,
                present: attendance?.status === 'Present' ? 1 : 0,
                late: attendance?.status === 'Late' ? 1 : 0,
                absent: isWeekend ? 0 : (attendance?.status === 'Absent' ? 1 : (attendance ? 0 : 1)),
            });
        }
        
        return days;
    };

    // Calculate monthly statistics
    const getMonthlyStats = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthRecords = (attendanceHistory || []).filter(a => {
            const recordDate = new Date(a.date);
            return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
        });

        const presentDays = monthRecords.filter(a => a.status === 'Present').length;
        const lateDays = monthRecords.filter(a => a.status === 'Late').length;
        const totalDays = monthRecords.length;
        const avgHours = monthRecords.length > 0
            ? monthRecords.reduce((sum, a) => sum + a.workingHours, 0) / monthRecords.length
            : 0;

        return {
            presentDays,
            lateDays,
            totalDays,
            avgHours: Number(avgHours.toFixed(1)),
            percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
        };
    };

    const weeklyData = getLast7Days();
    const monthlyStats = getMonthlyStats();

    // Calculate progress ring percentage (0-100)
    const progressPercentage = monthlyStats.percentage;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Attendance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="day" 
                                stroke="#64748B"
                                fontSize={12}
                            />
                            <YAxis 
                                stroke="#64748B"
                                fontSize={12}
                                domain={[0, 1]}
                                ticks={[0, 1]}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                }}
                            />
                            <Bar dataKey="present" stackId="a" fill="#16A34A" radius={[4, 4, 0, 0]}>
                                {weeklyData.map((entry, index) => (
                                    <Cell key={`cell-present-${index}`} fill="#16A34A" />
                                ))}
                            </Bar>
                            <Bar dataKey="late" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]}>
                                {weeklyData.map((entry, index) => (
                                    <Cell key={`cell-late-${index}`} fill="#F59E0B" />
                                ))}
                            </Bar>
                            <Bar dataKey="absent" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]}>
                                {weeklyData.map((entry, index) => (
                                    <Cell key={`cell-absent-${index}`} fill="#DC2626" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
                            <span className="text-sm text-gray-600">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                            <span className="text-sm text-gray-600">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#DC2626]"></div>
                            <span className="text-sm text-gray-600">Absent</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8">
                        {/* Progress Ring */}
                        <div className="relative w-48 h-48 mb-6">
                            <svg className="transform -rotate-90 w-48 h-48">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="#E2E8F0"
                                    strokeWidth="16"
                                    fill="none"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="#16A34A"
                                    strokeWidth="16"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 80}`}
                                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - progressPercentage / 100)}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-[#1E293B]">{progressPercentage}%</p>
                                    <p className="text-sm text-gray-600 mt-1">Attendance</p>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                            <div className="text-center p-4 bg-[#F0FDF4] rounded-lg">
                                <p className="text-2xl font-bold text-[#16A34A]">{monthlyStats.presentDays}</p>
                                <p className="text-xs text-gray-600 mt-1">Present Days</p>
                            </div>
                            <div className="text-center p-4 bg-[#FEF3C7] rounded-lg">
                                <p className="text-2xl font-bold text-[#F59E0B]">{monthlyStats.lateDays}</p>
                                <p className="text-xs text-gray-600 mt-1">Late Days</p>
                            </div>
                            <div className="text-center p-4 bg-[#F0F9FF] rounded-lg col-span-2">
                                <p className="text-2xl font-bold text-[#2563EB]">{monthlyStats.avgHours}h</p>
                                <p className="text-xs text-gray-600 mt-1">Avg Hours/Day</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

