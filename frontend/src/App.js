import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './Pages/LoginSignup';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import MainContent from './Components/MainContent/MainContent';
import Policies from './Components/Policies/Policies';
import Drafts from './Components/Drafts/Drafts';
import ViewPolicy from './Components/ViewPolicy/ViewPolicy';
import CDrafts from './Components/CDrafts/CDrafts';
import Pending from './Components/Pending/Pending';
import Approved from './Components/Approved/Approved';
import Publish from './Components/Publish/Publish';
import Newmod from './Components/Newmod/Newmod';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || ''); // Get userRole from local storage

  useEffect(() => {
    localStorage.setItem('userRole', userRole); // Store userRole in local storage
  }, [userRole]);

  const handleLogin = (name, role) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    localStorage.removeItem('userRole'); // Remove userRole from local storage upon logout
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar userName={userName} userRole={userRole} onLogout={handleLogout} />
        {isLoggedIn ? (
          <div className="main-container">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/admin/policies" element={<Policies userRole={userRole} />} />
                <Route path='/admin/policies/drafts' element={<CDrafts userRole={userRole}/>}/>
                <Route path='/admin/policies/pending' element={<Pending userRole={userRole}/>}/>
                <Route path='/admin/policies/approved' element={<Approved userRole={userRole}/>}/>
                <Route path='/admin/policies/publish' element={<Publish userRole={userRole}/>}/>
                <Route path="/edit" element={<Drafts userRole={userRole}/>} />
                <Route path="/view" element={<ViewPolicy userRole={userRole}/>} />
                <Route path="/newmod" element={<Newmod userRole={userRole} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginSignup onLogin={handleLogin} setUserRole={setUserRole} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
