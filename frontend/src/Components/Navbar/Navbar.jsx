import React from 'react';
import './Navbar.css';
import logout from '../../assets/logout.png';
import { useNavigate } from 'react-router-dom';


const Navbar = ({ userName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">G | K</div>
      <div className="navbar-title">Document Management</div>
      <div className="navbar-user">
        <div className="user-name">{userName}</div>
        <div className="logout" onClick={handleLogout}><img src={logout} alt="Logout" /></div>
      </div>
    </div>
  );
};

export default Navbar;
