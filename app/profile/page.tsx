'use client';

import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAttendance } from '@/contexts/AttendanceContext';
import { User, Mail, Briefcase, Camera, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
    const { employee, fetchEmployee } = useAttendance();

    const DEMO_EMPLOYEE_ID = process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_ID || 'demo_employee_123';

    useEffect(() => {
        fetchEmployee(DEMO_EMPLOYEE_ID);
    }, []);

    return (
        <AppLayout
            employeeName={employee?.name || 'Employee'}
            employeeRole={employee?.role || 'Employee'}
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[#1E293B]">Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your profile and registered photos</p>
                </div>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center">
                                    <User size={32} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-[#1E293B]">{employee?.name || 'Loading...'}</h3>
                                    <p className="text-gray-600">{employee?.role || 'Employee'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Mail className="text-[#2563EB]" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{employee?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Briefcase className="text-[#2563EB]" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="font-medium">{employee?.role || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Camera className="text-[#2563EB]" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600">Registered Photos</p>
                                        <p className="font-medium">{employee?.faceImages?.length || 0} photos</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Calendar className="text-[#2563EB]" size={24} />
                                    <div>
                                        <p className="text-sm text-gray-600">Member Since</p>
                                        <p className="font-medium">
                                            {employee?.createdAt
                                                ? new Date(employee.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Registered Photos */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Registered Face Photos</CardTitle>
                            <Button
                                onClick={() => (window.location.href = '/registration')}
                                variant="outline"
                                size="sm"
                            >
                                Update Photos
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {employee?.faceImages && employee.faceImages.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {employee.faceImages.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Registered ${index + 1}`}
                                            className="w-full aspect-square object-cover rounded-lg border-2 border-[#2563EB] cursor-pointer hover:scale-105 transition-transform"
                                            onClick={() => window.open(url, '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 font-semibold">
                                                View
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Camera className="mx-auto mb-4 text-gray-400" size={64} />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Photos Registered</h3>
                                <p className="text-gray-500 mb-6">Register your face photos to enable attendance marking</p>
                                <Button onClick={() => (window.location.href = '/registration')} variant="primary">
                                    Register Photos
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" disabled>
                                <User className="mr-2" size={20} />
                                Edit Profile (Coming Soon)
                            </Button>
                            <Button variant="outline" className="w-full justify-start" disabled>
                                <Mail className="mr-2" size={20} />
                                Change Email (Coming Soon)
                            </Button>
                            <Button variant="danger" className="w-full justify-start" disabled>
                                Delete Account (Coming Soon)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
