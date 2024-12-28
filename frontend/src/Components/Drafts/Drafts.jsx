import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Drafts.css';

const Drafts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const policy = location.state ? location.state.policy : null;

  const [policyNo, setPolicyNo] = useState(policy ? policy.policyNumber : '');
  const [type, setType] = useState(policy ? policy.locationType : '');
  const [department, setDepartment] = useState(policy ? policy.department : '');
  const [classification, setClassification] = useState(policy ? policy.classification : '');
  const [sbu, setSbu] = useState(policy ? policy.sbu : '');
  const [category, setCategory] = useState(policy ? policy.category : '');
  const [title, setTitle] = useState(policy ? policy.title : '');
  const [description, setDescription] = useState(policy ? policy.description : '');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      policyNumber: policyNo,
      locationType: type,
      department,
      classification,
      sbu,
      category,
      title,
      description
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/policies/${policyNo}`, data);

      if (response.status === 200) {
        console.log('Policy updated successfully');
        navigate('/view', { state: { policy: response.data, userRole: 'employee' } }); // Redirect to view page
      } else {
        console.error('Failed to update policy');
      }
    } catch (error) {
      console.error('Error updating policy:', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Document Management</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="policy-no">Policy No.</label>
            <input
              type="text"
              id="policy-no"
              value={policyNo}
              onChange={(e) => setPolicyNo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department/Function Name</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="classification">Classification</label>
            <select
              id="classification"
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="restricted">Restricted</option>
              <option value="confidential">Confidential</option>
              <option value="protected">Protected</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sbu">SBU</label>
            <input
              type="text"
              id="sbu"
              value={sbu}
              onChange={(e) => setSbu(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Drafts;
