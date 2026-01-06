'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface CameraCaptureProps {
    onCapture: (photo: string) => void;
    onClose?: () => void;
    showPreview?: boolean;
}

export function CameraCapture({ onCapture, onClose, showPreview = true }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Start camera
    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startCamera = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
            }

            setIsLoading(false);
        } catch (err: any) {
            console.error('Camera error:', err);

            if (err.name === 'NotAllowedError') {
                setError('Camera permission denied. Please allow camera access.');
            } else if (err.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else {
                setError('Failed to access camera. Please try again.');
            }

            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64
        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(photoData);
    };

    const confirmPhoto = () => {
        if (capturedPhoto) {
            onCapture(capturedPhoto);
            stopCamera();
        }
    };

    const retakePhoto = () => {
        setCapturedPhoto(null);
    };

    return (
        <div className="relative">
            {/* Camera View */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center text-white">
                            <div className="animate-pulse mb-2">
                                <Camera size={48} />
                            </div>
                            <p>Starting camera...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center text-white p-6">
                            <X size={48} className="mx-auto mb-4 text-[#DC2626]" />
                            <p className="mb-4">{error}</p>
                            <Button onClick={startCamera} variant="primary">
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {/* Video Stream */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${capturedPhoto ? 'hidden' : 'block'}`}
                        />

                        {/* Captured Photo Preview */}
                        {capturedPhoto && showPreview && (
                            <img
                                src={capturedPhoto}
                                alt="Captured"
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Face Detection Overlay */}
                        {!capturedPhoto && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative w-64 h-64 border-4 border-[#2563EB] rounded-full opacity-50">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2563EB] rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-[#2563EB] rounded-full animate-pulse"></div>
                                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2563EB] rounded-full animate-pulse"></div>
                                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2563EB] rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            {!error && !isLoading && (
                <div className="mt-4 flex items-center justify-center gap-4">
                    {!capturedPhoto ? (
                        <>
                            <Button onClick={capturePhoto} variant="primary" size="lg">
                                <Camera className="mr-2" size={20} />
                                Capture Photo
                            </Button>
                            {onClose && (
                                <Button onClick={onClose} variant="outline" size="lg">
                                    Cancel
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Button onClick={confirmPhoto} variant="success" size="lg">
                                <Check className="mr-2" size={20} />
                                Confirm
                            </Button>
                            <Button onClick={retakePhoto} variant="outline" size="lg">
                                Retake
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
