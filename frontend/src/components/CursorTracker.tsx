import { useEffect, useRef } from "react";

export interface CursorData {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

interface CursorTrackerProps {
    onMove: (cursorData: CursorData) => void;
}

const CursorTracker = ({ onMove }: CursorTrackerProps) => {
    const previousPosition = useRef({ x: 0, y: 0, time: Date.now() });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const currentTime = Date.now();
            const deltaTime = (currentTime - previousPosition.current.time) / 1000;

            const vx = (event.clientX - previousPosition.current.x) / deltaTime;
            const vy = (event.clientY - previousPosition.current.y) / deltaTime;

            onMove({ x: event.clientX, y: event.clientY, vx, vy });

            previousPosition.current = { x: event.clientX, y: event.clientY, time: currentTime };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [onMove]);

    return null;
};

export default CursorTracker;
