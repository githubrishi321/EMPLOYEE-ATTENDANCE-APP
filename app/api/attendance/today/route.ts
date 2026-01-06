import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { formatDate } from '@/lib/utils';
import { validateObjectId } from '@/lib/validation';

/**
 * GET /api/attendance/today
 * Get today's attendance record for an employee
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        // Validate ObjectId format
        const validationError = validateObjectId(employeeId, 'Employee ID');
        if (validationError) {
            return NextResponse.json(validationError, { status: 400 });
        }

        const today = formatDate(new Date());
        const attendance = await Attendance.findOne({
            employeeId,
            date: today,
        });

        return NextResponse.json({
            success: true,
            data: attendance,
        });
    } catch (error) {
        console.error('Get today attendance error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch today\'s attendance' },
            { status: 500 }
        );
    }
}
