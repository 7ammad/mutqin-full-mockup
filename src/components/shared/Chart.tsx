"use client";

import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
    [key: string]: string | number;
}

interface ChartProps {
    type: "line" | "area" | "bar" | "pie";
    data: ChartDataItem[];
    dataKey: string;
    nameKey?: string;
    className?: string;
    colors?: string[];
    height?: number;
}

const DEFAULT_COLORS = [
    "var(--apple-blue)",
    "var(--apple-green)",
    "var(--apple-orange)",
    "var(--apple-purple)",
    "var(--apple-pink)",
    "var(--apple-red)",
];

export function Chart({
    type,
    data,
    dataKey,
    nameKey = "name",
    className,
    colors = DEFAULT_COLORS,
    height = 300,
}: ChartProps) {
    const renderChart = () => {
        switch (type) {
            case "line":
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--separator)" />
                        <XAxis dataKey={nameKey} stroke="var(--secondary-label)" />
                        <YAxis stroke="var(--secondary-label)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--system-background)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={colors[0]}
                            strokeWidth={2}
                            dot={{ fill: colors[0] }}
                        />
                    </LineChart>
                );

            case "area":
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--separator)" />
                        <XAxis dataKey={nameKey} stroke="var(--secondary-label)" />
                        <YAxis stroke="var(--secondary-label)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--system-background)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                );

            case "bar":
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--separator)" />
                        <XAxis dataKey={nameKey} stroke="var(--secondary-label)" />
                        <YAxis stroke="var(--secondary-label)" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--system-background)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                );

            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey={dataKey}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--system-background)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                    </PieChart>
                );

            default:
                return null;
        }
    };

    return (
        <LiquidGlassCard
            className={cn("p-6", className)}
            blurIntensity="lg"
            interactive={false}
        >
            <ResponsiveContainer width="100%" height={height}>
                {renderChart()}
            </ResponsiveContainer>
        </LiquidGlassCard>
    );
}

