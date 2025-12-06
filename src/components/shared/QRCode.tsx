"use client";

import { useQRCode } from "next-qrcode";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface QRCodeProps {
    text: string;
    size?: number;
    className?: string;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

// Convert RGB/RGBA to hex
function rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return "#000000";
    
    const r = parseInt(match[0], 10);
    const g = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

export function QRCode({
    text,
    size = 200,
    className,
    errorCorrectionLevel = "M",
}: QRCodeProps) {
    const { Canvas } = useQRCode();
    const [darkColor, setDarkColor] = useState("#000000"); // Default fallback

    // Get computed color value from CSS variable
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Create a temporary element to get computed color
            const tempEl = document.createElement("div");
            tempEl.style.color = "var(--label)";
            tempEl.style.position = "absolute";
            tempEl.style.visibility = "hidden";
            tempEl.style.pointerEvents = "none";
            document.body.appendChild(tempEl);
            
            const computedColor = window.getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);
            
            // Convert to hex if it's rgb/rgba
            if (computedColor && computedColor.startsWith("rgb")) {
                setDarkColor(rgbToHex(computedColor));
            } else if (computedColor && computedColor.startsWith("#")) {
                setDarkColor(computedColor);
            }
        }
    }, []);

    // If className includes !p-0, don't wrap in card (for inline use)
    const shouldWrap = !className?.includes('!p-0');
    
    const qrContent = (
        <Canvas
            text={text}
            options={{
                errorCorrectionLevel,
                margin: 2,
                scale: 4,
                width: size,
                color: {
                    dark: darkColor,
                    light: "#FFFFFF",
                },
            }}
        />
    );

    if (!shouldWrap) {
        return qrContent;
    }

    return (
        <LiquidGlassCard
            className={cn("p-4 inline-block", className)}
            blurIntensity="md"
            interactive={false}
        >
            {qrContent}
        </LiquidGlassCard>
    );
}


