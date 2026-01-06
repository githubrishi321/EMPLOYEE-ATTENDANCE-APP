import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { formatDate, calculateWorkingHours } from '@/lib/utils';

/**
 * POST /api/attendance/checkout
 * Mark checkout and calculate working hours
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { employeeId } = body;

        if (!employeeId) {
            return NextResponse.json(
                { success: false, error: 'Employee ID is required' },
                { status: 400 }
            );
        }

        // Find today's attendance record
        const today = formatDate(new Date());
        const attendance = await Attendance.findOne({
            employeeId,
            date: today,
        });

        if (!attendance) {
            return NextResponse.json(
                { success: false, error: 'No check-in record found for today' },
                { status: 404 }
            );
        }

        if (attendance.checkOut) {
            return NextResponse.json(
                { success: false, error: 'Already checked out for today' },
                { status: 409 }
            );
        }

        // Update checkout time and calculate working hours
        const checkOutTime = new Date();
        const workingHours = calculateWorkingHours(attendance.checkIn, checkOutTime);

        attendance.checkOut = checkOutTime;
        attendance.workingHours = workingHours;
        await attendance.save();

        return NextResponse.json({
            success: true,
            data: {
                checkOut: attendance.checkOut,
                workingHours: attendance.workingHours,
            },
        });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to mark checkout' },
            { status: 500 }
        );
    }
}
