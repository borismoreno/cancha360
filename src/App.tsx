import { Toaster } from "sonner";
import { AppRouter } from "./router/AppRouter"

export default function App() {
    return (
        <div className="min-h-screen bg-neutral-light">
            <Toaster position="top-right" />
            <AppRouter />
        </div>
    );
}
