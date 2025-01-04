import {Task} from "@/App.tsx";

type CountdownProps = {
    showCountdown: boolean;
    time: number;
    task: Task | null;
    step: number;
};

export default function Countdown({showCountdown, time, task, step}: CountdownProps) {

    return ((showCountdown || time <= 0) && (
            <div
                className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50 pointer-events-none">
            <span
                className="text-3xl font-bold max-w-screen-sm w-full rounded-full text-center flex items-center justify-center translate-y-8">
                {time > 0 ? time :
                    <p>
                        Click <span className={`${step === 0 && 'bg-green-500'}`}>{task?.action1.actionName}</span> and then <span className={`${step === 1 && 'bg-green-500'}`}>{task?.action2.actionName}</span>
                    </p>
                }
            </span>
            </div>
        )
    );
}