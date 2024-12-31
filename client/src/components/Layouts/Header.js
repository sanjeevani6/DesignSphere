import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []);
  // Extract teamCode from the current URL if it exists
  const teamCode = location.pathname.includes('/design/team/') 
    ? location.pathname.split('/design/team/')[1] 
    : null;
    
    console.log(teamCode)


  const logoutHandler = () => {
    localStorage.removeItem('user');
    message.success('Logout successful');
    navigate('/login');
  };
  const handleTemplatesNavigation = () => {
    if (teamCode) {
      console.log("abc")
      navigate('/templates', { state: { teamCode } }); // Pass teamCode to Templates
    } else {
      navigate('/templates'); // Navigate without teamCode if it's not available
    }
  };

  return (
    <>
      <ul className="nav nav-underline">
        <li className="nav-item">
          <Link className="nav-link active" to="/">DesignSphere</Link>
        </li>
        <li className="nav-item simp">
          {loginUser && loginUser.name}
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="/design">Design</Link>
        </li>
        <li className="nav-item">
          <button className="nav-link active" onClick={handleTemplatesNavigation}>Templates</button>
        </li>
        <li className="simp2">
          <button className="bt" onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    </>
  );
};

export default Header;
