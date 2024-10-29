import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const clientId = '272513661609-dlsg5lhebhojdk72qr40gk1itduhgk2i.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        {/* Protecting the homepage route */}
        <Route 
          path="/" 
          element={
            <ProtectedRoutes>
              <Homepage />
            </ProtectedRoutes>
          } 
        />
        {/* Public routes for login and register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export function ProtectedRoutes({ children }) {
  // Check if user is logged in by checking localStorage
  if (localStorage.getItem('user')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
