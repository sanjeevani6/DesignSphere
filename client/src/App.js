import {Routes,Route, Navigate} from 'react-router-dom'
import Homepage from './pages/HomePage';
import Register from './pages/Register.js';
import Login from './pages/Login';
import Templates from './components/Templates';

function App() {
  return (
    <>
     <Routes>
     <Route path="/" element = {<ProtectedRoutes>

<Homepage/>
</ProtectedRoutes>}/>
      <Route path="/templates" element={<Templates />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
     </Routes>
    </>
  
  );
}

export function ProtectedRoutes(props){
  if(localStorage.getItem('user')){
    return props.children
  }

else{
  return <Navigate to="/login" />
}
}
export default App;
