"use client";

interface Segment {
    color: string;
    completed: boolean;
}

interface DonutChartProps {
    segments: Segment[];
    completedCount: number;
    radius?: number;
    strokeWidth?: number;
}

export default function DonutChart({ segments, completedCount, radius = 90, strokeWidth = 20 }: DonutChartProps) {
    const size = radius * 2;
    const total = segments.length;

    if (total === 0) {
        return (
            <div className="relative flex items-center justify-center p-8">
                <div className="text-neutral-300">No habits added</div>
            </div>
        );
    }

    const segmentAngle = 360 / total;
    const gapAngle = total > 1 ? 4 : 0;
    const drawAngle = segmentAngle - gapAngle;

    const center = size / 2;
    const r = radius - strokeWidth / 2;

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    const createSegmentPath = (index: number) => {
        // Offset by gap/2 to center the gap? No, standard logic:
        const startAngle = index * segmentAngle + gapAngle / 2;
        const endAngle = startAngle + drawAngle;

        // SVG Path Arc
        // Start point (at endAngle because we draw counter-clockwise? Or clockwise?)
        // Standard SVG Arc:
        // M startX startY A radius radius 0 largeArc? sweep? endX endY
        // Let's draw clockwise.

        const start = polarToCartesian(center, center, r, startAngle); // Top (if angle 0 is top)
        const end = polarToCartesian(center, center, r, endAngle);

        const largeArcFlag = drawAngle > 180 ? 1 : 0;

        return [
            "M", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 1, end.x, end.y
        ].join(" ");
    };

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {segments.map((seg, i) => (
                    <path
                        key={i}
                        d={createSegmentPath(i)}
                        fill="none"
                        stroke={seg.completed ? seg.color : "#F5F5F5"}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out dark:[stroke:#404040]"
                    />
                ))}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    {completedCount}<span className="text-neutral-300 dark:text-neutral-600 text-3xl font-medium">/{total}</span>
                </span>
                <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 mt-2">
                    Keep going!
                </span>
            </div>
        </div>
    );
}
