'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KPICards } from '@/components/dashboard/KPICards';
import { AnalyticsSection } from '@/components/dashboard/AnalyticsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CameraCapture } from '@/components/attendance/CameraCapture';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useToast } from '@/components/ui/Toast';
import { Camera, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { calculateWorkingHours } from '@/lib/utils';

export default function DashboardPage() {
  const { employee, todayAttendance, attendanceHistory, isLoading, fetchEmployee, fetchTodayAttendance, fetchAttendanceHistory, markAttendance, markCheckout } = useAttendance();
  const { success, error: showError } = useToast();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [currentWorkingHours, setCurrentWorkingHours] = useState(0);

  // Demo employee ID
  const DEMO_EMPLOYEE_ID = process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_ID || 'demo_employee_123';

  useEffect(() => {
    // Fetch employee and today's attendance on mount
    fetchEmployee(DEMO_EMPLOYEE_ID);
    fetchTodayAttendance(DEMO_EMPLOYEE_ID);
    
    // Fetch attendance history for analytics
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    fetchAttendanceHistory(DEMO_EMPLOYEE_ID, month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update working hours timer
  useEffect(() => {
    if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
      const timer = setInterval(() => {
        const hours = calculateWorkingHours(new Date(todayAttendance.checkIn), new Date());
        setCurrentWorkingHours(hours);
      }, 1000);

      return () => clearInterval(timer);
    } else if (todayAttendance?.workingHours) {
      setCurrentWorkingHours(todayAttendance.workingHours);
    }
  }, [todayAttendance]);

  const handleMarkAttendance = async (photo: string) => {
    setIsProcessing(true);

    try {
      const result = await markAttendance(DEMO_EMPLOYEE_ID, photo);

      if (result.success) {
        setConfidence(result.confidence || null);
        success(`Attendance marked successfully! Confidence: ${result.confidence}%`);
        setShowAttendanceModal(false);

        // Refresh today's attendance
        setTimeout(() => {
          fetchTodayAttendance(DEMO_EMPLOYEE_ID);
        }, 500);
      } else {
        showError(result.error || 'Failed to mark attendance');
      }
    } catch (err) {
      showError('An error occurred while marking attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!todayAttendance) return;

    const confirmed = confirm('Are you sure you want to end your work day?');
    if (!confirmed) return;

    const result = await markCheckout(DEMO_EMPLOYEE_ID);

    if (result.success) {
      success(`Checked out successfully! Total hours: ${result.data.workingHours.toFixed(2)}h`);
      fetchTodayAttendance(DEMO_EMPLOYEE_ID);
    } else {
      showError(result.error || 'Failed to mark checkout');
    }
  };

  const hasCheckedIn = !!todayAttendance?.checkIn;
  const hasCheckedOut = !!todayAttendance?.checkOut;
  const hasRegisteredPhotos = employee?.faceImages && employee.faceImages.length >= 3;

  if (!employee && isLoading) {
    return (
      <AppLayout
        employeeName="Loading..."
        employeeRole="Employee"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      employeeName={employee?.name || 'Employee'}
      employeeRole={employee?.role || 'Employee'}
    >
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your attendance dashboard</p>
        </div>

        {/* Warning if no photos registered */}
        {!hasRegisteredPhotos && (
          <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-[#F59E0B] flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-[#92400E]">Photo Registration Required</p>
              <p className="text-sm text-[#92400E] mt-1">
                Please register your face photos before marking attendance.{' '}
                <a href="/registration" className="underline font-medium">
                  Register Now
                </a>
              </p>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <KPICards
          status={todayAttendance?.status || null}
          checkInTime={todayAttendance?.checkIn || null}
          checkOutTime={todayAttendance?.checkOut || null}
          workingHours={currentWorkingHours}
        />

        {/* Attendance Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Mark Attendance Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                {!hasCheckedIn ? (
                  <>
                    <Camera className="mx-auto mb-4 text-[#2563EB]" size={64} />
                    <h3 className="text-lg font-semibold mb-2">Ready to Check In?</h3>
                    <p className="text-gray-600 mb-6">
                      Click the button below to mark your attendance using facial recognition
                    </p>
                    <Button
                      onClick={() => setShowAttendanceModal(true)}
                      variant="primary"
                      size="lg"
                      disabled={!hasRegisteredPhotos}
                    >
                      <Camera className="mr-2" size={20} />
                      Mark Attendance
                    </Button>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mx-auto mb-4 text-[#16A34A]" size={64} />
                    <h3 className="text-lg font-semibold mb-2">Attendance Marked</h3>
                    <p className="text-gray-600">
                      You have successfully checked in for today!
                    </p>
                    {confidence && (
                      <p className="text-sm text-gray-500 mt-2">
                        Match Confidence: {confidence}%
                      </p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Check Out Card */}
          {hasCheckedIn && (
            <Card>
              <CardHeader>
                <CardTitle>End Work Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  {!hasCheckedOut ? (
                    <>
                      <LogOut className="mx-auto mb-4 text-[#F59E0B]" size={64} />
                      <h3 className="text-lg font-semibold mb-2">Ready to Leave?</h3>
                      <p className="text-gray-600 mb-2">
                        Current working hours:
                      </p>
                      <p className="text-3xl font-bold text-[#2563EB] mb-6">
                        {currentWorkingHours.toFixed(2)}h
                      </p>
                      <Button
                        onClick={handleCheckout}
                        variant="primary"
                        size="lg"
                      >
                        <LogOut className="mr-2" size={20} />
                        Check Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mx-auto mb-4 text-[#16A34A]" size={64} />
                      <h3 className="text-lg font-semibold mb-2">Checked Out</h3>
                      <p className="text-gray-600 mb-2">
                        Total working hours:
                      </p>
                      <p className="text-3xl font-bold text-[#2563EB]">
                        {todayAttendance?.workingHours.toFixed(2)}h
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analytics Section */}
        <AnalyticsSection attendanceHistory={attendanceHistory} />
      </div>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => !isProcessing && setShowAttendanceModal(false)}
        title="Mark Attendance"
        size="lg"
      >
        {isProcessing ? (
          <div className="text-center py-12">
            <div className="animate-pulse mb-4">
              <Camera className="mx-auto text-[#2563EB]" size={64} />
            </div>
            <p className="text-lg font-semibold">Processing...</p>
            <p className="text-gray-600 mt-2">Verifying your face</p>
          </div>
        ) : (
          <CameraCapture onCapture={handleMarkAttendance} />
        )}
      </Modal>
    </AppLayout>
  );
}
