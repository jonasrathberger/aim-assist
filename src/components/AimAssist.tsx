import React, { useEffect, useState, useCallback, useRef } from "react";
import { CursorData } from "@/components/CursorTracker.tsx";

interface ButtonData {
    id: string;
    ref: React.RefObject<HTMLButtonElement>;
}

interface AimAssistProps {
    cursorData: CursorData;
    buttons: ButtonData[];
}

const AimAssist = ({ cursorData, buttons }: AimAssistProps) => {
    const [highlightedButton, setHighlightedButton] = useState<string | null>(null);
    const [predictedPosition, setPredictedPosition] = useState({ x: 0, y: 0 });
    const predictionRef = useRef({ x: 0, y: 0 });

    const findHighlightedButton = useCallback(() => {
        const predictionTime = 0.2;
        const tolerance = 40;

        // Predict position
        const predictedX = cursorData.x + cursorData.vx * predictionTime;
        const predictedY = cursorData.y + cursorData.vy * predictionTime;

        // Find target button
        const targetButton = buttons.find(({ ref }) => {
            const button = ref.current;
            if (!button) return false;

            const rect = button.getBoundingClientRect();
            const isWithinX = predictedX >= rect.left - tolerance && predictedX <= rect.right + tolerance;
            const isWithinY = predictedY >= rect.top - tolerance && predictedY <= rect.bottom + tolerance;

            return isWithinX && isWithinY;
        });

        return targetButton ? targetButton.id : null;
    }, [cursorData, buttons]);

    useEffect(() => {
        const smoothingFactor = 0.1; // Adjust for desired smoothness
        const predictionTime = 0.2;

        // More advanced smoothing prediction
        const predictedX = cursorData.x + cursorData.vx * predictionTime;
        const predictedY = cursorData.y + cursorData.vy * predictionTime;

        // Smooth interpolation
        predictionRef.current = {
            x: predictionRef.current.x + smoothingFactor * (predictedX - predictionRef.current.x),
            y: predictionRef.current.y + smoothingFactor * (predictedY - predictionRef.current.y)
        };

        // Update predicted position
        setPredictedPosition({
            x: predictionRef.current.x,
            y: predictionRef.current.y
        });

        // Find and set highlighted button
        const newHighlightedButton = findHighlightedButton();
        setHighlightedButton(newHighlightedButton);
    }, [cursorData, findHighlightedButton]);

    useEffect(() => {
        // Modify button styles
        buttons.forEach(({ id, ref }) => {
            const button = ref.current;
            if (button) {
                if (highlightedButton === id) {
                    button.classList.add('bg-destructive', 'text-destructive-foreground');
                    button.classList.remove('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90');
                } else {
                    //button.classList.remove('bg-destructive', 'text-destructive-foreground');
                    //button.classList.add('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90');
                }
            }
        });

        // Cleanup function to remove classes
        return () => {
            buttons.forEach(({ ref }) => {
                const button = ref.current;
                if (button) {
                    //button.classList.remove('bg-destructive', 'text-destructive-foreground');
                    //button.classList.add('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90');
                }
            });
        };
    }, [highlightedButton, buttons]);

    return (
        <div className="relative">
            <div
                className="fixed w-12 h-12 rounded-full bg-red-500 bg-opacity-50 pointer-events-none z-50"
                style={{
                    left: `${predictedPosition.x - 24}px`,
                    top: `${predictedPosition.y - 24}px`,
                }}
            />
        </div>
    );
};

export default React.memo(AimAssist);