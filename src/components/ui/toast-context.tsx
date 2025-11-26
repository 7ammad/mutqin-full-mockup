"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'info' = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 p-4 rounded-ios shadow-lg border animate-in slide-in-from-right-full duration-300 backdrop-blur-xl",
                            toast.type === 'success'
                                ? "bg-[var(--apple-green)]/10 border-[var(--apple-green)]/30 text-[var(--apple-green)]"
                                : "bg-[var(--system-background)] border-[var(--border)] text-[var(--label)]"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                        <p className="text-sm font-medium flex-1">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
