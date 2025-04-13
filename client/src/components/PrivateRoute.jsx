import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, children }) => {
    console.log("user got:",user);
  if (!user) {
    console.log("no user in privateroute component recieved");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
