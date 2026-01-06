import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { validateObjectId } from '@/lib/validation';

/**
 * GET /api/employee
 * Get employee profile by ID (from query params or demo ID)
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('id') || process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_ID;

        // Validate ObjectId format
        const validationError = validateObjectId(employeeId, 'Employee ID');
        if (validationError) {
            return NextResponse.json(validationError, { status: 400 });
        }

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: employee,
        });
    } catch (error) {
        console.error('Get employee error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch employee profile' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/employee
 * Create a new employee (for demo/testing purposes)
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, role } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return NextResponse.json(
                { success: false, error: 'Employee with this email already exists' },
                { status: 409 }
            );
        }

        const employee = await Employee.create({
            name,
            email,
            role: role || 'Employee',
        });

        return NextResponse.json(
            {
                success: true,
                data: employee,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create employee error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create employee' },
            { status: 500 }
        );
    }
}
