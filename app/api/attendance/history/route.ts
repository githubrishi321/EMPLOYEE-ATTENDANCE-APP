import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import { validateObjectId } from '@/lib/validation';

/**
 * GET /api/attendance/history
 * Get attendance history with pagination and filtering
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const month = searchParams.get('month'); // Format: YYYY-MM
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Validate ObjectId format
        const validationError = validateObjectId(employeeId, 'Employee ID');
        if (validationError) {
            return NextResponse.json(validationError, { status: 400 });
        }

        // Build query
        const query: any = { employeeId };

        if (month) {
            // Filter by month (e.g., "2026-01")
            const regex = new RegExp(`^${month}`);
            query.date = { $regex: regex };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch attendance records
        const [records, total] = await Promise.all([
            Attendance.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Attendance.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                records,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Get attendance history error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch attendance history' },
            { status: 500 }
        );
    }
}
