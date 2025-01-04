import {Button} from "@/components/ui/button.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useRef, useState} from "react";
import Countdown from "@/components/Countdown.tsx";
import CursorTracker, {CursorData} from "@/components/CursorTracker.tsx";
import AimAssist from "@/components/AimAssist.tsx";

function App() {

    const [cursorData, setCursorData] = useState<CursorData>({x: 0, y: 0, vx: 0, vy: 0});
    const [showCountdown, setShowCountdown] = useState(false);

    const buttonRefs = [
        {id: "home", content: "Home", ref: useRef<HTMLButtonElement>(null)},
        {id: "about", content: "About", ref: useRef<HTMLButtonElement>(null)},
        {id: "services", content: "Services", ref: useRef<HTMLButtonElement>(null)},
        {id: "blog", content: "Blog", ref: useRef<HTMLButtonElement>(null)},
        {id: "contact", content: "Contact", ref: useRef<HTMLButtonElement>(null)},
        {id: "go-up", content: "Go up", ref: useRef<HTMLButtonElement>(null)},
        {id: "see-more", content: "See more", ref: useRef<HTMLButtonElement>(null)}
    ];

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <header className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-2xl font-bold uppercase">Logo</h1>
                    <nav className="flex space-x-4">
                        <Button ref={buttonRefs[0].ref} variant="link">{buttonRefs[0].content}</Button>
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
            {showCountdown && <Countdown initialTime={3}/>}
            <div className="w-full h-screen flex items-center justify-center">
                <CursorTracker onMove={setCursorData}/>
                <AimAssist cursorData={cursorData} buttons={buttonRefs}/>
            </div>
        </ThemeProvider>
    )
}

export default App
