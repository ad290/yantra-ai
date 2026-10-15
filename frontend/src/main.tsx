import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './app/queryClient.ts'
import { ToastContainer } from "react-toastify";
import AuthBootStrap from './components/auth/AuthBootStrap.tsx'
import { store } from './app/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBootStrap />
        <ToastContainer theme="colored" draggable position="bottom-right" autoClose={1000} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
