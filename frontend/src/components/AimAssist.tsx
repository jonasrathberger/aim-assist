import React, { useEffect, useState, useCallback, useRef } from "react";
import { CursorData } from "@/components/CursorTracker.tsx";

interface ButtonData {
    id: string;
    ref: React.RefObject<HTMLButtonElement>;
}

interface AimAssistProps {
    cursorData: CursorData;
    buttons: ButtonData[];
    mode: string;
    handleNext: (id: string) => void;
}

const AimAssist = ({ cursorData, buttons, handleNext }: AimAssistProps) => {
    const [highlightedButton, setHighlightedButton] = useState<string | null>(null);
    const predictionRef = useRef({ x: 0, y: 0 });
    const lastHighlightedButtonRef = useRef<string | null>(null);

    const findHighlightedButton = useCallback(() => {
        const predictionTime = 0.2;
        const tolerance = 40;

        // Predict position
        const predictedX = cursorData.x + cursorData.vx * predictionTime;
        const predictedY = cursorData.y + cursorData.vy * predictionTime;

        // Find the nearest target button
        let closestButton: string | null = null;
        let minDistance = Infinity;

        buttons.forEach(({ id, ref }) => {
            const button = ref.current;
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const dx = Math.max(rect.left - predictedX, 0, predictedX - rect.right);
            const dy = Math.max(rect.top - predictedY, 0, predictedY - rect.bottom);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < tolerance && distance < minDistance) {
                minDistance = distance;
                closestButton = id;
            }
        });

        return closestButton || lastHighlightedButtonRef.current;
    }, [cursorData, buttons]);

    useEffect(() => {
        const baseSmoothing = 0.1;
        const velocityFactor = Math.min(Math.max(Math.abs(cursorData.vx) + Math.abs(cursorData.vy), 0.5), 2);
        const smoothingFactor = baseSmoothing / velocityFactor;

        const predictionTime = 0.2;

        // Smooth prediction
        const predictedX = cursorData.x + cursorData.vx * predictionTime;
        const predictedY = cursorData.y + cursorData.vy * predictionTime;

        predictionRef.current = {
            x: predictionRef.current.x + smoothingFactor * (predictedX - predictionRef.current.x),
            y: predictionRef.current.y + smoothingFactor * (predictedY - predictionRef.current.y)
        };

        const newHighlightedButton = findHighlightedButton();
        if (newHighlightedButton) {
            lastHighlightedButtonRef.current = newHighlightedButton;
        }
        setHighlightedButton(newHighlightedButton);
    }, [cursorData, findHighlightedButton]);

    useEffect(() => {
        buttons.forEach(({ id, ref }) => {
            const button = ref.current;
            if (button) {
                if (highlightedButton === id) {
                    button.classList.add('outline', 'outline-4', 'outline-green-500');
                } else {
                    button.classList.remove('outline', 'outline-4', 'outline-green-500');
                }
            }
        });

        // Cleanup function
        return () => {
            buttons.forEach(({ ref }) => {
                const button = ref.current;
                if (button) {
                    button.classList.remove('outline', 'outline-4', 'outline-green-500');
                }
            });
        };
    }, [highlightedButton, buttons]);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (highlightedButton) {
                if (event.key === " ") {
                    event.preventDefault();
                    handleNext(highlightedButton);
                }
            }
        },
        [highlightedButton, handleNext]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return <></>
};

export default React.memo(AimAssist);
