'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CameraCapture } from '@/components/attendance/CameraCapture';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useToast } from '@/components/ui/Toast';
import { Camera, CheckCircle, X, AlertCircle, Info } from 'lucide-react';

export default function PhotoRegistrationPage() {
    const { employee, fetchEmployee, registerPhotos } = useAttendance();
    const { success, error: showError } = useToast();
    const [step, setStep] = useState(1);
    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
    const [showCamera, setShowCamera] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const DEMO_EMPLOYEE_ID = process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_ID || 'demo_employee_123';
    const MIN_PHOTOS = 3;
    const MAX_PHOTOS = 5;

    useEffect(() => {
        fetchEmployee(DEMO_EMPLOYEE_ID);
    }, []);

    const handlePhotoCapture = (photo: string) => {
        if (capturedPhotos.length < MAX_PHOTOS) {
            setCapturedPhotos([...capturedPhotos, photo]);
            setShowCamera(false);
        }
    };

    const removePhoto = (index: number) => {
        setCapturedPhotos(capturedPhotos.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (capturedPhotos.length < MIN_PHOTOS) {
            showError(`Please capture at least ${MIN_PHOTOS} photos`);
            return;
        }

        if (capturedPhotos.length > MAX_PHOTOS) {
            showError(`Please provide no more than ${MAX_PHOTOS} photos`);
            return;
        }

        // Validate that all photos are valid base64 strings
        const invalidPhotos = capturedPhotos.filter(photo => !photo || !photo.startsWith('data:image'));
        if (invalidPhotos.length > 0) {
            showError('Some photos are invalid. Please capture them again.');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await registerPhotos(DEMO_EMPLOYEE_ID, capturedPhotos);

            if (result.success) {
                success('Photos registered successfully!');
                setStep(3);

                // Refresh employee data
                setTimeout(() => {
                    fetchEmployee(DEMO_EMPLOYEE_ID);
                }, 500);
            } else {
                // Show detailed error message
                const errorMsg = result.error || 'Failed to register photos';
                console.error('Photo registration error:', errorMsg);
                showError(errorMsg);
            }
        } catch (err: any) {
            console.error('Photo registration exception:', err);
            const errorMsg = err.message || 'An error occurred while registering photos. Please try again.';
            showError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasExistingPhotos = employee?.faceImages && employee.faceImages.length > 0;

    return (
        <AppLayout
            employeeName={employee?.name || 'Employee'}
            employeeRole={employee?.role || 'Employee'}
        >
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-[#1E293B]">Photo Registration</h1>
                    <p className="text-gray-600 mt-1">Register your face photos for attendance verification</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s
                                        ? 'bg-[#2563EB] text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-16 h-1 ${step > s ? 'bg-[#2563EB]' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Instructions */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Do's */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="text-[#16A34A]" size={24} />
                                        <h3 className="font-semibold text-lg">Do's</h3>
                                    </div>
                                    <ul className="space-y-2 ml-8">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#16A34A] mt-1">✓</span>
                                            <span>Ensure good lighting on your face</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#16A34A] mt-1">✓</span>
                                            <span>Look directly at the camera</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#16A34A] mt-1">✓</span>
                                            <span>Keep a neutral expression</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#16A34A] mt-1">✓</span>
                                            <span>Remove glasses if possible</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#16A34A] mt-1">✓</span>
                                            <span>Capture from slightly different angles</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Don'ts */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <X className="text-[#DC2626]" size={24} />
                                        <h3 className="font-semibold text-lg">Don'ts</h3>
                                    </div>
                                    <ul className="space-y-2 ml-8">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#DC2626] mt-1">✗</span>
                                            <span>Don't cover your face with hands or objects</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#DC2626] mt-1">✗</span>
                                            <span>Don't take photos in dim lighting</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#DC2626] mt-1">✗</span>
                                            <span>Don't wear hats or sunglasses</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#DC2626] mt-1">✗</span>
                                            <span>Don't take blurry photos</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Info */}
                                <div className="bg-[#F0F9FF] border border-[#2563EB] rounded-lg p-4 flex items-start gap-3">
                                    <Info className="text-[#2563EB] flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold text-[#1E3A8A]">Important</p>
                                        <p className="text-sm text-[#1E3A8A] mt-1">
                                            You need to capture {MIN_PHOTOS}-{MAX_PHOTOS} photos for accurate face recognition.
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={() => setStep(2)} variant="primary" size="lg" className="w-full">
                                    Continue to Photo Capture
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Photo Capture */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Step 2: Capture Photos ({capturedPhotos.length}/{MAX_PHOTOS})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Camera */}
                                {showCamera ? (
                                    <CameraCapture
                                        onCapture={handlePhotoCapture}
                                        onClose={() => setShowCamera(false)}
                                    />
                                ) : (
                                    <div className="text-center py-8">
                                        <Camera className="mx-auto mb-4 text-[#2563EB]" size={64} />
                                        <h3 className="text-lg font-semibold mb-2">
                                            {capturedPhotos.length === 0
                                                ? 'Ready to capture your photos?'
                                                : `${capturedPhotos.length} photo${capturedPhotos.length > 1 ? 's' : ''} captured`}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {capturedPhotos.length < MIN_PHOTOS
                                                ? `Capture at least ${MIN_PHOTOS - capturedPhotos.length} more photo${MIN_PHOTOS - capturedPhotos.length > 1 ? 's' : ''}`
                                                : 'You can capture up to 2 more photos'}
                                        </p>
                                        <Button
                                            onClick={() => setShowCamera(true)}
                                            variant="primary"
                                            size="lg"
                                            disabled={capturedPhotos.length >= MAX_PHOTOS}
                                        >
                                            <Camera className="mr-2" size={20} />
                                            {capturedPhotos.length === 0 ? 'Start Capturing' : 'Capture Another Photo'}
                                        </Button>
                                    </div>
                                )}

                                {/* Photo Grid */}
                                {capturedPhotos.length > 0 && !showCamera && (
                                    <div>
                                        <h4 className="font-semibold mb-3">Captured Photos</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                            {capturedPhotos.map((photo, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={photo}
                                                        alt={`Captured ${index + 1}`}
                                                        className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                    <button
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute top-2 right-2 bg-[#DC2626] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {!showCamera && (
                                    <div className="flex gap-4">
                                        <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            variant="primary"
                                            className="flex-1"
                                            disabled={capturedPhotos.length < MIN_PHOTOS}
                                            isLoading={isSubmitting}
                                        >
                                            Submit Photos
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 3: Registration Complete</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <CheckCircle className="mx-auto mb-4 text-[#16A34A]" size={80} />
                                <h3 className="text-2xl font-bold mb-2">Photos Registered Successfully!</h3>
                                <p className="text-gray-600 mb-8">
                                    You can now mark your attendance using facial recognition.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <Button onClick={() => window.location.href = '/'} variant="primary" size="lg">
                                        Go to Dashboard
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setStep(1);
                                            setCapturedPhotos([]);
                                        }}
                                        variant="outline"
                                        size="lg"
                                    >
                                        Register Again
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Existing Photos */}
                {hasExistingPhotos && step !== 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Currently Registered Photos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {employee.faceImages.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Registered ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg border-2 border-[#2563EB]"
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
