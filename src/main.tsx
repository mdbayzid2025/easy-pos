import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './components/Router/router.tsx'
import './index.css'
import { Toaster } from "sonner";
import ReduxProvider from './redux/lib/ReduxProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />   
    <ReduxProvider>
    <RouterProvider router={router}/>    
    </ReduxProvider> 
  </StrictMode>,
)
