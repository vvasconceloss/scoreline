import './styles/index.css';
import { createRoot } from 'react-dom/client';
import { AppRoutes } from "./routes/appRoutes.js";
import { ThemeProvider } from './components/theme-provider.js';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <AppRoutes />
  </ThemeProvider>
);