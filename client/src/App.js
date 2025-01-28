import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
//import socket from './socket'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Design from './pages/Design';
import EventPage from './pages/EventPage'; 
import { UserProvider } from './context/UserContext'; 
import Templates from './pages/Templates';
import Landing from './pages/Landing';
import PrintOrderPage from './pages/PrintOrderPage';

  
 
import TeamForm from './pages/TeamForm';

function App() {
  const clientId = '272513661609-dlsg5lhebhojdk72qr40gk1itduhgk2i.apps.googleusercontent.com';
 
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <Routes>
         {/* Default route to introduction page */}
         <Route exact path="/" element={<Navigate to="/introduction" />} />

{/* Introduction Page */}
<Route path="/introduction" element={<Landing />} />
          {/* Protected route for homepage */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoutes>
                <Homepage />
              </ProtectedRoutes>
            } 
          />
          
          
          <Route 
            path="/event/:designId" 
            element={
              
                <EventPage />
              
            } 
          />
          <Route 
            path="/event/teams/:teamCode" 
            element={
              
                <EventPage />
              
            } 
          />
          
          <Route path="/print/:designId" element={<PrintOrderPage />} />
          <Route path="/print/teams/:teamCode" element={<PrintOrderPage />} />
          {/* Route for the Design page */}
          <Route path="/design" element={<Design />} />
          <Route path="/design/:designId" element={<Design />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/teams" element={<TeamForm />} />
          <Route path="/design/team/:teamCode" element={<Design />} />

          {/* Public routes for login and register */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

// Protected Routes Component to check for user authentication
export function ProtectedRoutes({ children }) {
  // Check if user is logged in by checking localStorage
  if (localStorage.getItem('user')) {
    return children;  // If user is logged in, render the children (protected page)
  } else {
    return <Navigate to="/login" />;  // If not logged in, redirect to login page
  }
}

export default App;
