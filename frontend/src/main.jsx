import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth/AuthProvider'
import ThemeToggle from './components/layout/ThemeToggle'
import App from './App'
import './styles/index.css'

const qc = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={qc}>
    <AuthProvider>
      <ThemeToggle />
      <App />
    </AuthProvider>
  </QueryClientProvider>
)
