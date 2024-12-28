import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import axios from 'axios';
import './CDrafts.css';
import { useNavigate } from 'react-router-dom';

const Policies = ({ userRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    locationType: '',
    sbu: '',
    department: '',
    status: 'draft'
  });
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  const sbuToDepartments = {
    hydro: ['Department A', 'Department B'],
    wind: ['Department C', 'Department D'],
    solar: ['Department E', 'Department F']
  };

  const sbuPrefix = {
    hydro: 'H-',
    wind: 'W-',
    solar: 'S-'
  };

  const departmentCode = {
    'Department A': 'DA-',
    'Department B': 'DB-',
    'Department C': 'DC-',
    'Department D': 'DD-',
    'Department E': 'DE-',
    'Department F': 'DF-'
  };

  const generatePolicyNumber = (sbu, department) => {
    const randomNumber = Math.floor(Math.random() * 10000);
    const sbuPrefixCode = sbuPrefix[sbu] || '';
    const deptCode = departmentCode[department] || '';
    return `DFT-${sbuPrefixCode}${deptCode}${randomNumber}`;
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));

    if (name === 'sbu') {
      setDepartments(sbuToDepartments[value] || []);
      setFormData(prevFormData => ({ ...prevFormData, department: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const policyNumber = generatePolicyNumber(formData.sbu, formData.department);
    const newPolicy = { ...formData, policyNumber };

    try {
      const response = await axios.post('http://localhost:5000/api/policies', newPolicy);
      const createdPolicy = response.data;
      setPolicies([...policies, createdPolicy]);
      setFormData({ locationType: '', sbu: '', department: '', status: 'draft' });
      setDepartments([]);
      setShowModal(false);
      navigate('/edit', { state: { policy: createdPolicy, userRole } }); // Navigate to view with the new policy data
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };


  const handleDelete = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/api/policies/${policies[index]._id}`);
      const newPolicies = [...policies];
      newPolicies.splice(index, 1);
      setPolicies(newPolicies);
    } catch (error) {
      console.error('Error deleting policy:', error);
    }
  };

  const handleEdit = (policy) => {
    navigate('/edit', { state: { policy } });
  };

  const handleView = (policy) => {
    navigate('/view', { state: { policy, userRole } });
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/policies');
        setPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, []);

  const drafts = policies.filter(policy => policy.status === 'draft');

  return (
    <div className='policies'>
      <div className='list'>
        <div><h3>List of Policies</h3></div>
        {userRole !== 'manager' && userRole !== 'head' && (
          <div className='icbut' onClick={toggleModal}><h3> + Create</h3></div>
        )}
      </div>
      {userRole !== 'manager' && userRole !== 'head' && (
        <Modal show={showModal} onClose={toggleModal}>
          <div className="form-container">
            <h2>Create New Policy</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Location Type:</label>
                <select value={formData.locationType} onChange={handleInputChange} name="locationType" required>
                  <option value="">Select Location Type</option>
                  <option value="plant">Plant</option>
                </select>
              </div>
              <div>
                <label>SBU:</label>
                <select name="sbu" value={formData.sbu} onChange={handleInputChange} required>
                  <option value="">Select SBU</option>
                  <option value="hydro">Hydro</option>
                  <option value="wind">Wind</option>
                  <option value="solar">Solar</option>
                </select>
              </div>
              <div>
                <label>Department/Function Name:</label>
                <select name="department" value={formData.department} onChange={handleInputChange} required>
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      <div className="policies-list">
        <h3>Draft Policies</h3>
        {drafts.length === 0 ? (
          <p className='nodata'>No Drafts ...</p>
        ) : (
          drafts.map((policy, index) => (
            <div key={index} className="policy-item">
              <h4>{policy.policyNumber}</h4>
              <div className="policy-details">
                <p><strong>Location Type:</strong> {policy.locationType}</p>
                <p><strong>SBU:</strong> {policy.sbu}</p>
                <p><strong>Department/Function Name:</strong> {policy.department}</p>
              </div>
              {userRole !== 'manager' && userRole !== 'head' && (
                <>
                  <button className='delete' onClick={() => handleDelete(index)}>Delete</button>
                  <button className='edit' onClick={() => handleEdit(policy)}>Edit</button>
                  <button className='edit' onClick={() => handleView(policy)}>View</button>
                </>
              )}
              {(userRole === 'manager' || userRole === 'head') && (
                <button className='edit' onClick={() => handleView(policy)}>View</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Policies;
