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
import Signin from './components/Signin';
import { AuthProvider } from './context/useAuth';
import { MobileProvider } from './context/useIsMobile';
import { ModalProvider } from './context/MondalContext';
import { AlertProvider } from './context/useAlert';
import { ContactUpdationProvider } from './context/useContactUpdate';
import Chat from './components/Chat';

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
        path: '/signin',
        element: <Signin />
      },
      {
        path: '/chat/:id',
        element: <Chat/>
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
      <AlertProvider>
        <AuthProvider>
          <ContactUpdationProvider>
            <ModalProvider>
              <MobileProvider>
                <RouterProvider router={router} />
              </MobileProvider>
            </ModalProvider>
          </ContactUpdationProvider>
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  </StrictMode>,
)
