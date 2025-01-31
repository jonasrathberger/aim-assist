import {Button} from "@/components/ui/button.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEffect, useRef, useState} from "react";
import Countdown from "@/components/Countdown.tsx";
import CursorTracker, {CursorData} from "@/components/CursorTracker.tsx";
import AimAssist from "@/components/AimAssist.tsx";
import {useParams} from "react-router";

type Action = {
    actionId: string;
    actionName: string;
}

export type Task = {
    action1: Action;
    action2: Action;
}

const logTaskTiming = async (task, startTime, endTime, username, mode, isCorrect) => {
    const logEntry = {
        username,
        mode,
        action1Name: task.action1.actionName,
        action2Name: task.action2.actionName,
        startTime,
        endTime,
        duration: (endTime - startTime).toFixed(2),
        isCorrect,
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
    const {user} = useParams(); // Get username from route
    const username = user || localStorage.getItem("username");
    const {mode} = useParams(); // Get mode from route
    const selectedMode = mode || localStorage.getItem("mode");

    const initialTime = 3;
    const [cursorData, setCursorData] = useState<CursorData>({x: 0, y: 0, vx: 0, vy: 0});
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdownActive, setCountdownActive] = useState(false);
    const [countdownFinished, setCountdownFinished] = useState(false);
    const [time, setTime] = useState(initialTime);
    const [task, setTask] = useState<Task | null>(null);
    const [taskStartTime, setTaskStartTime] = useState<number | null>(null);
    const [step, setStep] = useState<number>(0); // 0 = not started, 1 = first action, 2 = second action
    const [lastTask, setLastTask] = useState<Task | null>(null);

    const [completedTaskCount, setCompletedTaskCount] = useState<number>(0);

    // Handle task progress
    const handleNextStep = async (clickedActionId) => {
        const endTime = Date.now() / 1000;

        if (task && step === 0) {
            const isCorrect = clickedActionId === task.action1.actionId;
            await logTaskTiming(task, taskStartTime, endTime, username, selectedMode, isCorrect);
            if (isCorrect) setStep(1); // Mark first action as complete
        } else if (task && step === 1) {
            const isCorrect = clickedActionId === task.action2.actionId;
            await logTaskTiming(task, taskStartTime, endTime, username, selectedMode, isCorrect);
            if (isCorrect) {
                setCompletedTaskCount((prevCount) => prevCount + 1);
                setLastTask(task); // Save the last task
                resetCountdown();
            }
        }
    };

    const resetCountdown = () => {
        setStep(0);
        setTask(null);
        setTime(initialTime);
        setCountdownActive(false);
        setCountdownFinished(false);
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
        {action1: {actionId: "home", actionName: "Home"}, action2: {actionId: "see-more", actionName: "See more"}},
        {action1: {actionId: "about", actionName: "About"}, action2: {actionId: "services", actionName: "Services"}},
        {action1: {actionId: "contact", actionName: "Contact"}, action2: {actionId: "go-up", actionName: "Go up"}},
        {action1: {actionId: "see-more", actionName: "See more"}, action2: {actionId: "blog", actionName: "Blog"}}
    ];

    const [availableTasks, setAvailableTasks] = useState<Task[]>(tasks);

    const getRandomTask = () => {
        let updatedTasks = availableTasks;
        if (updatedTasks.length === 0) {
            updatedTasks = tasks;
        }

        let task;
        do {
            const randomIndex = Math.floor(Math.random() * updatedTasks.length);
            task = updatedTasks[randomIndex];
        } while (task === lastTask); // Ensure the new task is not the same as the last task

        setAvailableTasks(updatedTasks.filter(t => t !== task));
        return task;
    };

    // Countdown timer
    useEffect(() => {
        if (!countdownActive) return; // Only run if countdown is active

        if (time <= 0 && !task) {
            const randomTask = getRandomTask();
            setTask(randomTask);
            setTaskStartTime(Date.now() / 1000);
            setCountdownActive(false); // Stop countdown when task starts
            setCountdownFinished(true);
        }

        if (time <= 0) return;

        const interval = setInterval(() => {
            setTime((prevTime) => {
                const updatedTime = prevTime - 1;
                if (updatedTime <= 0) setCountdownFinished(true);
                return updatedTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [time, task, countdownActive]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <header className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-2xl font-bold uppercase">Logo</h1>
                    <nav className="grid grid-cols-4">
                        <Button ref={buttonRefs[0].ref} variant="link"
                                onClick={() => handleNextStep(buttonRefs[0].id)}>{buttonRefs[0].content}</Button>
                        <Button ref={buttonRefs[1].ref} variant="link"
                                onClick={() => handleNextStep(buttonRefs[1].id)}>{buttonRefs[1].content}</Button>
                        <Button ref={buttonRefs[2].ref} variant="link"
                                onClick={() => handleNextStep(buttonRefs[2].id)}>{buttonRefs[2].content}</Button>
                        <Button ref={buttonRefs[3].ref} variant="link"
                                onClick={() => handleNextStep(buttonRefs[3].id)}>{buttonRefs[3].content}</Button>
                    </nav>
                    <Button ref={buttonRefs[4].ref} variant="default"
                            onClick={() => handleNextStep(buttonRefs[4].id)}>{buttonRefs[4].content}</Button>
                </div>
            </header>
            <p className="fixed bottom-2 left-2">{completedTaskCount}</p>
            <div className="w-full h-screen flex flex-col items-center justify-between p-8">
                <div></div>
                <div
                    className="w-16 h-16 rounded-full bg-gray-500 hover:scale-110 hover:bg-transparent hover:border-2 transition"
                    onMouseEnter={() => {
                        setShowCountdown(true);
                        setCountdownActive(true);
                    }}
                    onMouseLeave={() => {
                        if (!countdownFinished) resetCountdown();
                    }}
                ></div>
                <div className="flex flex-row gap-4">
                    <Button ref={buttonRefs[6].ref} onClick={() => handleNextStep(buttonRefs[6].id)}>
                        {buttonRefs[6].content}
                    </Button>
                    <Button ref={buttonRefs[5].ref} variant="secondary"
                            onClick={() => handleNextStep(buttonRefs[5].id)}>
                        {buttonRefs[5].content}
                    </Button>
                </div>
            </div>
            <Countdown showCountdown={showCountdown} time={time} task={task} step={step}/>
            {(selectedMode === 'aim-assist' || selectedMode === 'aim-guidance') && (
                <div className=" fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none">
                    <CursorTracker onMove={setCursorData}/>
                    <AimAssist cursorData={cursorData} buttons={buttonRefs} mode={selectedMode} handleNext={handleNextStep}/>
                </div>
            )}
        </ThemeProvider>
    )
}

export default App
