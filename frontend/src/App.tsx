import {Button} from "@/components/ui/button.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEffect, useRef, useState} from "react";
import Countdown from "@/components/Countdown.tsx";
import CursorTracker, {CursorData} from "@/components/CursorTracker.tsx";
import AimAssist from "@/components/AimAssist.tsx";

type Action = {
    actionId: string;
    actionName: string;
}

export type Task = {
    action1: Action;
    action2: Action;
}

const logTaskTiming = async (task, startTime, endTime) => {
    const logEntry = {
        action1Name: task.action1.actionName,
        action2Name: task.action2.actionName,
        startTime,
        endTime,
        duration: (endTime - startTime).toFixed(2),
    };

    try {
        await fetch('http://localhost:3000/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logEntry),
        });
    } catch (error) {
        console.error('Failed to log task:', error);
    }
};

function App() {

    const initialTime = 3;
    const [cursorData, setCursorData] = useState<CursorData>({x: 0, y: 0, vx: 0, vy: 0});
    const [showCountdown, setShowCountdown] = useState(false);
    const [time, setTime] = useState(initialTime);
    const [task, setTask] = useState<Task | null>(null);
    const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
    const [step, setStep] = useState<number>(0); // 0 = not started, 1 = first action, 2 = second action

    // Countdown timer
    useEffect(() => {
        if (time <= 0 && !task) {
            const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
            setTask(randomTask);
            setTaskStartTime(Date.now() / 1000);
        }

        if (time <= 0) return;

        const interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time, task]);

    // Handle task progress
    const handleNextStep = async () => {
        if (step === 0) {
            setStep(1); // Mark first action as complete
        } else if (step === 1) {
            const endTime = Date.now() / 1000;
            if (task && taskStartTime !== null) {
                await logTaskTiming(task, taskStartTime, endTime);
            }
            setStep(0); // Reset steps for the next task
            setTask(null); // Clear the task
            setTime(initialTime); // Reset countdown
        }
    };

    const buttonRefs = [
        {id: "home", content: "Home", ref: useRef<HTMLButtonElement>(null)},
        {id: "about", content: "About", ref: useRef<HTMLButtonElement>(null)},
        {id: "services", content: "Services", ref: useRef<HTMLButtonElement>(null)},
        {id: "blog", content: "Blog", ref: useRef<HTMLButtonElement>(null)},
        {id: "contact", content: "Contact", ref: useRef<HTMLButtonElement>(null)},
        {id: "go-up", content: "Go up", ref: useRef<HTMLButtonElement>(null)},
        {id: "see-more", content: "See more", ref: useRef<HTMLButtonElement>(null)}
    ];

    const tasks: Task[] = [
        {action1: {actionId: "home", actionName: "Home"}, action2: {actionId: "about", actionName: "About"}},
        {action1: {actionId: "services", actionName: "Services"}, action2: {actionId: "blog", actionName: "Blog"}},
        {action1: {actionId: "contact", actionName: "Contact"}, action2: {actionId: "go-up", actionName: "Go up"}},
        {action1: {actionId: "see-more", actionName: "See more"}, action2: {actionId: "home", actionName: "Home"}}
    ];

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <header className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-2xl font-bold uppercase">Logo</h1>
                    <nav className="flex space-x-4">
                        <Button
                            ref={buttonRefs[0].ref} variant="link" onClick={handleNextStep}>{buttonRefs[0].content}</Button>
                        <Button ref={buttonRefs[1].ref} variant="link">{buttonRefs[1].content}</Button>
                        <Button ref={buttonRefs[2].ref} variant="link">{buttonRefs[2].content}</Button>
                        <Button ref={buttonRefs[3].ref} variant="link">{buttonRefs[3].content}</Button>
                        <Button ref={buttonRefs[4].ref} variant="link">{buttonRefs[4].content}</Button>
                    </nav>
                </div>
            </header>
            <div className="w-full h-screen flex flex-col items-center justify-between p-8">
                <div></div>
                <div
                    className="w-16 h-16 rounded-full bg-gray-500 hover:scale-110 hover:bg-transparent hover:border-2 transition"
                    onMouseEnter={() => setShowCountdown(true)}
                    onMouseLeave={() => setShowCountdown(false)}
                ></div>
                <div className="flex flex-col gap-4">
                    <Button ref={buttonRefs[5].ref}>
                        {buttonRefs[5].content}
                    </Button>
                    <Button ref={buttonRefs[6].ref} variant="outline">
                        {buttonRefs[6].content}
                    </Button>
                </div>
            </div>
            <Countdown showCountdown={showCountdown} time={time} task={task} step={step}/>
            <div className="w-full h-screen flex items-center justify-center">
                <CursorTracker onMove={setCursorData}/>
                <AimAssist cursorData={cursorData} buttons={buttonRefs}/>
            </div>
        </ThemeProvider>
    )
}

export default App
