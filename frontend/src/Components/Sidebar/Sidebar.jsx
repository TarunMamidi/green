import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [adminOpen, setAdminOpen] = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);
  const [adminPoliciesOpen, setAdminPoliciesOpen] = useState(false);

  const toggleAdmin = () => setAdminOpen(!adminOpen);
  const toggleSite = () => setSiteOpen(!siteOpen);
  const toggleAdminPolicies = () => setAdminPoliciesOpen(!adminPoliciesOpen);

  return (
    <div className="sidebar">
      <Link to="/dashboard" className="sidebar-item">Dashboard</Link>
      <Link to="/policies" className="sidebar-item">Policies</Link>
      <Link to="/procedures" className="sidebar-item">Procedures</Link>
      <Link to="/formats" className="sidebar-item">Formats</Link>

      <div className="sidebar-section" onClick={toggleAdmin}>Admin</div>
      <div className={`sidebar-subitems ${adminOpen ? 'open' : ''}`}>
        <div className="sidebar-subsection" onClick={toggleAdminPolicies}>
          Policies
        </div>
        <div className={`sidebar-subsubitems ${adminPoliciesOpen ? 'open' : ''}`}>
          <Link to="/admin/policies/drafts" className="sidebar-item">Drafts</Link>
          <Link to="/admin/policies/pending" className="sidebar-item">Pending</Link>
          <Link to="/admin/policies/approved" className='sidebar-item'>Approved</Link>
          <Link to="/admin/policies/publish" className='sidebar-item'>Published</Link>
        </div>
      </div>

      <div className="sidebar-section" onClick={toggleSite}>Site</div>
      <div className={`sidebar-subitems ${siteOpen ? 'open' : ''}`}>
        <Link to="/site/policies" className="sidebar-item">Policies</Link>
        <Link to="/site/procedures" className="sidebar-item">Procedures</Link>
      </div>
    </div>
  );
};

export default Sidebar;
