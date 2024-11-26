import {Button} from "@/components/ui/button.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

function App() {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <header className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-2xl font-bold uppercase">Logo</h1>
                    <nav className="flex space-x-4">
                        <Button variant="link">Home</Button>
                        <Button variant="link">About</Button>
                        <Button variant="link">Services</Button>
                    </nav>
                    <Button>
                        Contact
                    </Button>
                </div>
            </header>
            <div className="w-full h-screen flex flex-col items-center justify-between p-8">
                <div></div>
                <div className="w-16 h-16 rounded-full bg-gray-500 hover:scale-110 transition"></div>
                <Button>
                    Bottom
                </Button>
            </div>
        </ThemeProvider>
    )
}

export default App
