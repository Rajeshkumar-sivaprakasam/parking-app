import { RouterProvider } from "react-router-dom";
import { StoreProvider } from "./providers/StoreProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { router } from "./providers/router";
import { PWAInstallPrompt } from "../shared/ui/PWAInstallPrompt";

function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <RouterProvider router={router} />
        <PWAInstallPrompt />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
