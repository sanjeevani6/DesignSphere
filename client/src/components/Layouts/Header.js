import React,{useEffect,useState} from 'react'
import {Link,useNavigate} from "react-router-dom";
import { message } from 'antd';
const Header=()=>{

  const[loginUser,setLoginUser]=useState('');
  const Navigate=useNavigate();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'))
      if(user){
        setLoginUser(user)
      }
  },[]);
  const logoutHandler=()=>{

    localStorage.removeItem("user");
     message.success('logout successfully');
    Navigate('/login');
  }
    return(
        <>
          
          <ul className="nav nav-underline">
  <li className="nav-item  ">
    <Link  className="nav-link active" aria-current="page" to="/">DesignSphere</Link>
  </li>
  <li className="nav-item simp">
   {loginUser&& loginUser.name}
  </li>
  <li className="nav-item  ">
    <Link  className="nav-link active" aria-current="page" to="#">Design</Link>
  </li>
  <li className="nav-item  ">
    <Link  className="nav-link active" aria-current="page" to="#">Templates</Link>
  </li>
 
  <li className="simp2">
   <button className='bt' onClick={logoutHandler}>Logout</button>
  </li>
  
  
</ul>
        </>
    )
}

export default Header;