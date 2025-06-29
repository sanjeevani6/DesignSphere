import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Pages
import Homepage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Templates from './pages/Templates';
import Landing from './pages/Landing';
import PrintOrderPage from './pages/PrintOrderPage';
import SharePage from './pages/SharePage';
import TeamForm from './pages/TeamForm';
import Design from "./pages/Design";

// Components
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/register"];

    if (!publicRoutes.includes(location.pathname)) {
      axios
        .get("/api/v1/users/check-auth", { withCredentials: true })
        .then((res) => {
          console.log("response of user in useEffect of app", res.data);
          if (res.data.user) {
            setUser(res.data.user); // Set the user if authenticated
          } else {
            setUser(null);
          }
        })
        .catch((err) => {
          console.error("Not authenticated", err);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // don't show loading screen on public pages
    }
  }, [location.pathname]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
       
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute user={user}>
              <Homepage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/design"
          element={
            <PrivateRoute user={user}>
              <Design user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/design/:designId"
          element={
            <PrivateRoute user={user}>
              <Design user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/design/team/:teamCode"
          element={
            <PrivateRoute user={user}>
              <Design user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <PrivateRoute user={user}>
              <Templates user={user}/>
            </PrivateRoute>
          }
        />
        <Route
          path="/print/:designId"
          element={
            <PrivateRoute user={user}>
              <PrintOrderPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/print/teams/:teamCode"
          element={
            <PrivateRoute user={user}>
              <PrintOrderPage user={user} />
            </PrivateRoute>
          }
        /> <Route
          path="/share"
          element={
            <PrivateRoute user={user}>
              <SharePage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/share/teams/:teamCode"
          element={
            <PrivateRoute user={user}>
              <SharePage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <PrivateRoute user={user}>
              <TeamForm user={user} />
            </PrivateRoute>
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
