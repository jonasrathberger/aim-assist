import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";

export default function Start() {
    const [username, setUsername] = useState("");
    const [mode, setMode] = useState("aim-assist"); // State for mode
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (username.trim()) {
            // Save username and mode for logging purposes
            localStorage.setItem("username", username);
            localStorage.setItem("mode", mode); // Save mode as well

            // Navigate to the App route with username as a parameter
            navigate(`/${username}/${mode}`);
        } else {
            alert("Please enter a username!");
        }
    };

    return (
        <div className="w-full h-screen flex flex-col gap-8 items-center justify-center">
            <h1 className="text-4xl font-bold">Start</h1>
            <Input
                type="text"
                className="w-96 p-2 border border-gray-300 rounded-lg"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <RadioGroup
                defaultValue="aim-assist"
                value={mode} // Bind mode state
                onValueChange={(value) => setMode(value)} // Update mode state
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aim-assist" id="aim-assist" />
                    <Label htmlFor="aim-assist">Aim Assist</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aim-guidance" id="aim-guidance" />
                    <Label htmlFor="aim-guidance">Aim Guidance</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nothing" id="nothing" />
                    <Label htmlFor="nothing">Nothing</Label>
                </div>
            </RadioGroup>

            <Button type="button" className="mt-4" onClick={handleSubmit}>
                Start
            </Button>
        </div>
    );
}
