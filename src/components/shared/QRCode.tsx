"use client";

import { useQRCode } from "next-qrcode";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { cn } from "@/lib/utils";

interface QRCodeProps {
    text: string;
    size?: number;
    className?: string;
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

export function QRCode({
    text,
    size = 200,
    className,
    errorCorrectionLevel = "M",
}: QRCodeProps) {
    const { Canvas } = useQRCode();

    return (
        <LiquidGlassCard
            className={cn("p-4 inline-block", className)}
            blurIntensity="md"
            interactive={false}
        >
            <Canvas
                text={text}
                options={{
                    errorCorrectionLevel,
                    margin: 2,
                    scale: 4,
                    width: size,
                    color: {
                        dark: "var(--label)",
                        light: "transparent",
                    },
                }}
            />
        </LiquidGlassCard>
    );
}


