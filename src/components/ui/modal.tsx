"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-ios bg-[var(--system-background)] backdrop-blur-xl p-6 shadow-lg animate-in zoom-in-95 duration-200 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold leading-none tracking-tight text-[var(--label)]">
                        {title}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 flex items-center justify-center gap-2">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
