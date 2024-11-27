import {Button} from "@/components/ui/button.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useRef, useState} from "react";
import Countdown from "@/components/Countdown.tsx";
import CursorTracker, {CursorData} from "@/components/CursorTracker.tsx";
import AimAssist from "@/components/AimAssist.tsx";

function App() {

    const [cursorData, setCursorData] = useState<CursorData>({ x: 0, y: 0, vx: 0, vy: 0 });
    const [showCountdown, setShowCountdown] = useState(false);

    const buttonRefs = [
        { id: "home", ref: useRef<HTMLButtonElement>(null) },
        { id: "about", ref: useRef<HTMLButtonElement>(null) },
        { id: "services", ref: useRef<HTMLButtonElement>(null) },
        { id: "contact", ref: useRef<HTMLButtonElement>(null) },
        { id: "go-up", ref:useRef<HTMLButtonElement>(null) },
    ];

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <header className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-2xl font-bold uppercase">Logo</h1>
                    <nav className="flex space-x-4">
                        <Button ref={buttonRefs[0].ref} variant="link">Home</Button>
                        <Button ref={buttonRefs[1].ref} variant="link">About</Button>
                        <Button ref={buttonRefs[2].ref} variant="link">Services</Button>
                    </nav>
                    <Button ref={buttonRefs[3].ref}>
                        Contact
                    </Button>
                </div>
            </header>
            <div className="w-full h-screen flex flex-col items-center justify-between p-8">
                <div></div>
                <div
                    className="w-16 h-16 rounded-full bg-gray-500 hover:scale-110 hover:bg-transparent hover:border-2 transition"
                    onMouseEnter={() => setShowCountdown(true)}
                    onMouseLeave={() => setShowCountdown(false)}
                ></div>
                <Button ref={buttonRefs[4].ref}>
                    Go up
                </Button>
            </div>
            {showCountdown && <Countdown initialTime={3}/>}
            <div className="w-full h-screen flex items-center justify-center">
                <CursorTracker onMove={setCursorData}/>
                <AimAssist cursorData={cursorData} buttons={buttonRefs}/>
            </div>
        </ThemeProvider>
    )
}

export default App
