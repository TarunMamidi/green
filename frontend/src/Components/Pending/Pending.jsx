import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pending.css';
import { useNavigate } from 'react-router-dom';

const Pending = ({ userRole }) => {

  const [policies, setPolicies] = useState([]);

 
  const navigate = useNavigate();

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

 
  const pending = policies.filter(policy => policy.status === 'pending');

  return (
    <div className='policies'>
      
      <div className="policies-list">
        <h3>Pending Policies</h3>
        {pending.length === 0 ? (
          <p className='nodata'>No Pending Policies ...</p>
        ) : (
          pending.map((policy, index) => (
            <div key={index} className="policy-item">
              <h4>{policy.policyNumber}</h4>
              <div className="policy-details">
                <p><strong>Location Type:</strong> {policy.locationType}</p>
                <p><strong>SBU:</strong> {policy.sbu}</p>
                <p><strong>Department/Function Name:</strong> {policy.department}</p>
              </div>
              {userRole !== 'employee' && userRole !== 'head' && (
                <button className='delete' onClick={() => handleDelete(index)}>Delete</button>
              )}
              <button className='edit' onClick={() => handleView(policy)}>View</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pending;
