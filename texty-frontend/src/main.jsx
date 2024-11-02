import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { ThemeProvider } from '@material-tailwind/react';
import Navbar from './components/Navbar'
import Home from './components/Home'
import Signup from './components/Signup'
import { AuthProvider } from './context/useAuth';
import { MobileProvider } from './context/useIsMobile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        index: true,
        element: <Navigate to="/home" replace />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MobileProvider>
          <RouterProvider router={router} />
        </MobileProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
