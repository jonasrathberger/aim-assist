import React, { useEffect, useState, useCallback, useRef } from "react";
import { CursorData } from "@/components/CursorTracker.tsx";
import {Button} from "@/components/ui/button.tsx";

interface ButtonData {
    id: string;
    ref: React.RefObject<HTMLButtonElement>;
}

interface AimAssistProps {
    cursorData: CursorData;
    buttons: ButtonData[];
    mode: string;
    handleNext: (id: string, accepted: boolean) => void;
}

const AimAssist = ({ cursorData, buttons, mode, handleNext }: AimAssistProps) => {
    const [highlightedButton, setHighlightedButton] = useState<string | null>(null);
    const [predictedPosition, setPredictedPosition] = useState({ x: 0, y: 0 });
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

        setPredictedPosition({
            x: predictionRef.current.x,
            y: predictionRef.current.y
        });

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
                if (event.key === "y") {
                    handleNext(highlightedButton, true);
                } else if (event.key === "x") {
                    handleNext(highlightedButton, false);
                }
            }
        },
        [highlightedButton, handleNext]
    );

    const handleMouseClick = useCallback(
        (event: MouseEvent) => {
            if (highlightedButton) {
                if (event.button === 0) {
                    // Left click -> Accept
                    handleNext(highlightedButton, true);
                } else if (event.button === 2) {
                    // Right click -> Decline
                    handleNext(highlightedButton, false);
                }
            }
        },
        [highlightedButton, handleNext]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        window.addEventListener("mousedown", handleMouseClick);
        const disableContextMenu = (e: MouseEvent) => e.preventDefault();
        window.addEventListener("contextmenu", disableContextMenu);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
            window.removeEventListener("mousedown", handleMouseClick);
            window.removeEventListener("contextmenu", disableContextMenu);
        };
    }, [handleKeyPress]);

    return (
        <div className="relative">
            <div
                className="fixed w-12 h-12 rounded-full bg-red-500 bg-opacity-50 pointer-events-none z-50"
                style={{
                    left: `${predictedPosition.x - 24}px`,
                    top: `${predictedPosition.y - 24}px`,
                }}
            />
            {mode === 'aim-assist' && highlightedButton && (
                <div
                    className="fixed flex gap-24 items-center z-50 pointer-events-none"
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <Button
                        onClick={() => handleNext(highlightedButton, true)}
                        className="p-2 bg-green-500 text-white rounded-md pointer-events-auto"
                    >
                        <strong>Y</strong> - Accept
                    </Button>
                    <Button
                        onClick={() => handleNext(highlightedButton, false)}
                        className="p-2 bg-red-500 text-white rounded-md pointer-events-auto"
                    >
                        <strong>X</strong> - Decline
                    </Button>
                </div>
            )}
        </div>
    );
};

export default React.memo(AimAssist);
