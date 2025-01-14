import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import UserProvider from './context/UserContext'
import { BrowserRouter } from "react-router";

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <UserProvider>
          <App />
      </UserProvider>
    </BrowserRouter>
  </>,
)
