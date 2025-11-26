"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    value?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = Number(e.target.value);
            onValueChange?.([newValue]);
        };

        const percentage = ((value[0] - min) / (max - min)) * 100;

        return (
            <div className="relative w-full">
                <input
                    type="range"
                    ref={ref}
                    min={min}
                    max={max}
                    step={step}
                    value={value[0]}
                    onChange={handleChange}
                    className="sr-only"
                    {...props}
                />
                <div className="relative h-2 w-full rounded-full bg-[var(--system-fill)]">
                    <div
                        className="absolute h-2 rounded-full bg-[var(--apple-blue)] transition-all"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div
                    className="absolute top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--apple-blue)] shadow-md transition-all"
                    style={{ left: `${percentage}%` }}
                />
            </div>
        );
    }
)
Slider.displayName = "Slider"

export { Slider }

