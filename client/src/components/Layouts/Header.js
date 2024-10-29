import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    message.success('Logout successful');
    navigate('/login');
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
          <Link className="nav-link active" to="#">Design</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" to="#">Templates</Link>
        </li>
        <li className="simp2">
          <button className="bt" onClick={logoutHandler}>Logout</button>
        </li>
      </ul>
    </>
  );
};

export default Header;
