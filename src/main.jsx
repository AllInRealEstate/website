// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // 🆕 NEW IMPORTS
import App from './App.jsx'
import './index.css'
import './i18n'
import "leaflet/dist/leaflet.css";

//  Create a client instance outside the component tree
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //  CRITICAL SRE SETTING: Data is considered fresh for 5 minutes (300,000ms)
      // This prevents redundant fetches on navigation, boosting performance.
      staleTime: 1000 * 60 * 5, 
      // Prevents re-fetching data when the window regains focus (unless stale)
      refetchOnWindowFocus: false,
      // Prevents re-fetching if the component remounts (unless stale)
      refetchOnMount: false,
      // Aggressive caching (use data for 24 hours even if component unmounts)
      gcTime: 1000 * 60 * 60 * 24, 
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*  Wrap the entire application in the QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)