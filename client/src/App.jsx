import { Routes, Route, Navigate, Router } from 'react-router-dom';
import Homepage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
//import socket from './socket'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Design from './pages/Design';
import { UserProvider, UserContext, useUser } from './context/UserContext';
import { useContext } from 'react';
import Templates from './pages/Templates';
import Landing from './pages/Landing';
import PrintOrderPage from './pages/PrintOrderPage';
import SharePage from './pages/SharePage';

  
 
import TeamForm from './pages/TeamForm';
// ✅ ProtectedRoutes component (inline)
const ProtectedRoutes = ({ children }) => {
  const { currentUser, loading } = useUser();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
        <p>Loading user info...</p>
      </div>
    );
  }
  if (!currentUser) {
    console.warn("User not authenticated. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }
  

  return children;
};


function App() {
  const clientId = '272513661609-dlsg5lhebhojdk72qr40gk1itduhgk2i.apps.googleusercontent.com';
  return (
  <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoutes>
                  <Homepage />
                </ProtectedRoutes>
              }
            />

         <Route 
         path="/share/:designId"
          element={
         
           < SharePage />
         
         
         }
          />


            <Route
              path="/share/teams/:teamCode"
              element={
              
                  <SharePage />
               
              }
            />

            <Route
              path="/print/:designId"
              element={
                <ProtectedRoutes>
                  <PrintOrderPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/print/teams/:teamCode"
              element={
                <ProtectedRoutes>
                  <PrintOrderPage />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/design"
              element={
                <ProtectedRoutes>
                  <Design />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/design/:designId"
              element={
                <ProtectedRoutes>
                  <Design />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/templates"
              element={
                <ProtectedRoutes>
                  <Templates />
                </ProtectedRoutes>
              }
            />

<Route
  path="/teams"
  element={
    <ProtectedRoutes>
      <TeamForm />
    </ProtectedRoutes>
  }
/>


            <Route
              path="/design/team/:teamCode"
              element={
                <ProtectedRoutes>
                  <Design />
                </ProtectedRoutes>
              }
            />

            {/* Catch-all: Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
       
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;