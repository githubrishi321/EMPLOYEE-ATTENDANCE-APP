'use client';

import React from 'react';
import { Clock, LogIn, LogOut, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatTime } from '@/lib/utils';

interface KPICardsProps {
    status: 'Present' | 'Late' | 'Absent' | null;
    checkInTime: Date | null;
    checkOutTime: Date | null;
    workingHours: number;
}

export function KPICards({ status, checkInTime, checkOutTime, workingHours }: KPICardsProps) {
    const statusColors = {
        Present: 'bg-[#16A34A] text-white',
        Late: 'bg-[#F59E0B] text-white',
        Absent: 'bg-[#DC2626] text-white',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Today's Status */}
            <Card hover>
                <CardHeader>
                    <CardTitle className="text-sm text-gray-600 font-normal">Today's Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            {status ? (
                                <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${statusColors[status]}`}>
                                    {status}
                                </span>
                            ) : (
                                <span className="text-gray-400 text-sm">Not marked</span>
                            )}
                        </div>
                        <Clock className="text-[#2563EB]" size={32} />
                    </div>
                </CardContent>
            </Card>

            {/* Check-In Time */}
            <Card hover>
                <CardHeader>
                    <CardTitle className="text-sm text-gray-600 font-normal">Check-In Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            {checkInTime ? (
                                <p className="text-2xl font-bold text-[#1E293B]">
                                    {formatTime(new Date(checkInTime))}
                                </p>
                            ) : (
                                <p className="text-gray-400 text-sm">Not checked in</p>
                            )}
                        </div>
                        <LogIn className="text-[#16A34A]" size={32} />
                    </div>
                </CardContent>
            </Card>

            {/* Check-Out Time */}
            <Card hover>
                <CardHeader>
                    <CardTitle className="text-sm text-gray-600 font-normal">Check-Out Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            {checkOutTime ? (
                                <p className="text-2xl font-bold text-[#1E293B]">
                                    {formatTime(new Date(checkOutTime))}
                                </p>
                            ) : (
                                <p className="text-gray-400 text-sm">Not checked out</p>
                            )}
                        </div>
                        <LogOut className="text-[#F59E0B]" size={32} />
                    </div>
                </CardContent>
            </Card>

            {/* Working Hours */}
            <Card hover>
                <CardHeader>
                    <CardTitle className="text-sm text-gray-600 font-normal">Working Hours</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-[#1E293B]">
                                {workingHours.toFixed(2)}h
                            </p>
                        </div>
                        <Timer className="text-[#2563EB]" size={32} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
