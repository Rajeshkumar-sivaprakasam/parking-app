import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './providers/StoreProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './providers/router';

function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
