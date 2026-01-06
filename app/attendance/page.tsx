'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AttendancePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard where attendance marking happens
        router.push('/');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
    );
}
