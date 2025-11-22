import { Toaster } from "sonner";
import { AppRouter } from "./router/AppRouter"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './lib/store.ts'

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <div className="min-h-screen bg-neutral-light">
                    <Toaster position="top-right" />
                    <AppRouter />
                </div>
            </PersistGate>
        </Provider>
    );
}
