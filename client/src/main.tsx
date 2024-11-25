import './styles/index.css';
import { createRoot } from 'react-dom/client';
import { AppRoutes } from "./routes/appRoutes.js";

createRoot(document.getElementById('root')!).render( <AppRoutes /> );