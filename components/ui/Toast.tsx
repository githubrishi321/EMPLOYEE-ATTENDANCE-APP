import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    const styles = {
        success: 'bg-[#16A34A] text-white',
        error: 'bg-[#DC2626] text-white',
        info: 'bg-[#2563EB] text-white',
    };

    return (
        <div
            className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg w-full',
                styles[type],
                isVisible ? 'animate-fadeIn' : 'opacity-0 transition-opacity duration-300'
            )}
        >
            {icons[type]}
            <p className="flex-1 font-medium">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="hover:opacity-80 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast Manager Hook
interface ToastData {
    id: number;
    message: string;
    type: ToastType;
}

let toastId = 0;
const toastListeners: ((toasts: ToastData[]) => void)[] = [];
let toasts: ToastData[] = [];

export function useToast() {
    const [, setUpdate] = useState(0);

    useEffect(() => {
        const listener = () => setUpdate((n) => n + 1);
        toastListeners.push(listener);
        return () => {
            const index = toastListeners.indexOf(listener);
            if (index > -1) toastListeners.splice(index, 1);
        };
    }, []);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = toastId++;
        toasts = [...toasts, { id, message, type }];
        toastListeners.forEach((listener) => listener(toasts));
    };

    const removeToast = (id: number) => {
        toasts = toasts.filter((t) => t.id !== id);
        toastListeners.forEach((listener) => listener(toasts));
    };

    return {
        toasts,
        showToast,
        removeToast,
        success: (message: string) => showToast(message, 'success'),
        error: (message: string) => showToast(message, 'error'),
        info: (message: string) => showToast(message, 'info'),
    };
}

// Toast Container Component
export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md w-full px-4 md:px-0">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
