import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format time to HH:MM:SS
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

/**
 * Calculate working hours between two dates
 */
export function calculateWorkingHours(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Number((diff / (1000 * 60 * 60)).toFixed(2)); // Convert to hours with 2 decimal places
}

/**
 * Get status based on check-in time
 * Present: Before 9:30 AM
 * Late: After 9:30 AM
 */
export function getAttendanceStatus(checkInTime: Date): 'Present' | 'Late' {
    const checkInHour = checkInTime.getHours();
    const checkInMinute = checkInTime.getMinutes();

    // Late if after 9:30 AM
    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
        return 'Late';
    }

    return 'Present';
}

/**
 * Check if a date is weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Get month name from date
 */
export function getMonthName(date: Date): string {
    return date.toLocaleString('en-US', { month: 'long' });
}

/**
 * Get days in month
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Basic face matching simulation (placeholder for AI service)
 * In production, replace with actual AI face recognition service
 */
export function simulateFaceMatch(
    capturedPhoto: string,
    registeredPhotos: string[]
): { match: boolean; confidence: number } {
    // Simulate processing delay
    const confidence = Math.random() * 30 + 70; // Random confidence between 70-100%

    // For demo purposes, always return true if registered photos exist
    const match = registeredPhotos.length > 0;

    return {
        match,
        confidence: match ? Number(confidence.toFixed(2)) : 0,
    };
}

/**
 * Convert base64 to File object
 */
export function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}
