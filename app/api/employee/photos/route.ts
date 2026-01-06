import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { validateObjectId } from '@/lib/validation';

/**
 * POST /api/employee/photos
 * Register employee face photos (3-5 images)
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { employeeId, photos } = body;

        // Validate ObjectId format
        const validationError = validateObjectId(employeeId, 'Employee ID');
        if (validationError) {
            return NextResponse.json(validationError, { status: 400 });
        }

        if (!photos || !Array.isArray(photos)) {
            return NextResponse.json(
                { success: false, error: 'Photos array is required' },
                { status: 400 }
            );
        }

        if (photos.length < 3 || photos.length > 5) {
            return NextResponse.json(
                { success: false, error: 'Please provide 3-5 photos' },
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

        // Upload photos to Cloudinary
        try {
            const uploadPromises = photos.map((photo: string) =>
                uploadToCloudinary(photo, employeeId, 'registration')
            );

            const uploadedUrls = await Promise.all(uploadPromises);

            // Update employee with face image URLs
            employee.faceImages = uploadedUrls;
            await employee.save();

            return NextResponse.json({
                success: true,
                data: {
                    faceImages: employee.faceImages,
                },
            });
        } catch (uploadError: any) {
            console.error('Cloudinary upload error:', uploadError);

            // Provide more specific error messages
            if (uploadError.message?.includes('Cloudinary')) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Failed to upload photos to cloud storage. Please check your Cloudinary configuration.'
                    },
                    { status: 500 }
                );
            }

            throw uploadError; // Re-throw to be caught by outer catch
        }
    } catch (error: any) {
        console.error('Register photos error:', error);

        // Provide more specific error messages
        let errorMessage = 'Failed to register photos';

        if (error.message) {
            errorMessage = error.message;
        } else if (error.name === 'ValidationError') {
            errorMessage = 'Invalid photo data provided';
        } else if (error.name === 'CastError') {
            errorMessage = 'Invalid employee ID format';
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/employee/photos
 * Remove a specific photo from employee's registered photos
 */
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const photoUrl = searchParams.get('photoUrl');

        // Validate ObjectId format
        const validationError = validateObjectId(employeeId, 'Employee ID');
        if (validationError) {
            return NextResponse.json(validationError, { status: 400 });
        }

        if (!photoUrl) {
            return NextResponse.json(
                { success: false, error: 'Photo URL is required' },
                { status: 400 }
            );
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        // Remove photo from array
        employee.faceImages = employee.faceImages.filter((url: string) => url !== photoUrl);
        await employee.save();

        return NextResponse.json({
            success: true,
            data: {
                faceImages: employee.faceImages,
            },
        });
    } catch (error) {
        console.error('Delete photo error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete photo' },
            { status: 500 }
        );
    }
}
