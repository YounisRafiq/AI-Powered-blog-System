import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
);
