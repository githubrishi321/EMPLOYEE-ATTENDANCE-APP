import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { formatDate, getAttendanceStatus, simulateFaceMatch } from '@/lib/utils';
import { validateObjectId } from '@/lib/validation';

/**
 * POST /api/attendance
 * Mark attendance with photo verification
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { employeeId, photo } = body;

        // Validate ObjectId format
        const validationError = validateObjectId(employeeId, 'Employee ID');
        if (validationError) {
            return NextResponse.json(validationError, { status: 400 });
        }

        if (!photo) {
            return NextResponse.json(
                { success: false, error: 'Photo is required' },
                { status: 400 }
            );
        }

        // Find employee
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        // Check if employee has registered photos
        if (!employee.faceImages || employee.faceImages.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please register your face photos first',
                },
                { status: 400 }
            );
        }

        // Check for duplicate attendance today
        const today = formatDate(new Date());
        const existingAttendance = await Attendance.findOne({
            employeeId,
            date: today,
        });

        if (existingAttendance) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Attendance already marked for today',
                },
                { status: 409 }
            );
        }

        // Simulate face matching (replace with actual AI service in production)
        const matchResult = simulateFaceMatch(photo, employee.faceImages);

        if (!matchResult.match) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Face verification failed. Please try again.',
                    confidence: matchResult.confidence,
                },
                { status: 401 }
            );
        }

        // Upload attendance photo to Cloudinary
        const photoUrl = await uploadToCloudinary(photo, employeeId, 'attendance');

        // Create attendance record
        const checkInTime = new Date();
        const status = getAttendanceStatus(checkInTime);

        const attendance = await Attendance.create({
            employeeId,
            date: today,
            checkIn: checkInTime,
            status,
            attendancePhoto: photoUrl,
            workingHours: 0,
        });

        return NextResponse.json(
            {
                success: true,
                data: attendance,
                confidence: matchResult.confidence,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Mark attendance error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Attendance already marked for today' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to mark attendance' },
            { status: 500 }
        );
    }
}
