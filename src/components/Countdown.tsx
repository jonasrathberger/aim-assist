import { useState, useEffect } from "react";

type CountdownProps = {
    initialTime: number;
};

export default function Countdown({ initialTime }: CountdownProps) {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        if (time <= 0) return; // Stop the countdown at 0

        const interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount or time change
    }, [time]);

    return (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50 pointer-events-none">
            <span className="text-3xl font-bold h-16 w-16 rounded-full text-center flex items-center justify-center translate-y-8">
                {time > 0 ? time : "Go!"}
            </span>
        </div>
    );
}