import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewPolicy.css';
import Newmod from '../Newmod/Newmod';

const ViewPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { policy, userRole } = location.state;
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const updatePolicyStatus = async (updatedPolicy) => {
    try {
      await axios.put(`http://localhost:5000/api/policies/${policy.policyNumber}`, updatedPolicy);
    } catch (error) {
      console.error('Error updating policy status:', error);
      throw error;
    }
  };

  const handleSubmit = async (comments) => {
    try {
      let updatedPolicyNumber = policy.policyNumber;
      let updatedStatus = policy.status;

      if (userRole === 'employee' && policy.status === 'draft') {
        updatedStatus = 'pending';
        updatedPolicyNumber = policy.policyNumber.replace('DFT-', 'PD-');
      } else if (userRole === 'manager' && policy.status === 'pending') {
        updatedStatus = 'approved';
        updatedPolicyNumber = policy.policyNumber.replace('PD-', 'AP-');
      } else if (userRole === 'head' && policy.status === 'approved') {
        updatedStatus = 'publish';
        updatedPolicyNumber = policy.policyNumber.replace('AP-', 'PB-');
      }

      const updatedPolicy = {
        ...policy,
        status: updatedStatus,
        policyNumber: updatedPolicyNumber,
      };

      await updatePolicyStatus(updatedPolicy);
      navigate('/');
    } catch (error) {
      console.error('Error approving policy:', error);
    }
  };

  const handleApprove = () => {
    handleSubmit();
    setShowModal(false);
  };

  const handleReject = async (comments) => {
    try {
      let updatedPolicyNumber = policy.policyNumber;
      let updatedStatus = policy.status;

      if (userRole === 'manager' && policy.status === 'pending') {
        updatedStatus = 'draft';
        updatedPolicyNumber = policy.policyNumber.replace('PD-', 'DFT-');
      } else if (userRole === 'head' && policy.status === 'approved') {
        updatedStatus = 'pending';
        updatedPolicyNumber = policy.policyNumber.replace('AP-', 'PD-');
      }

      const updatedPolicy = {
        ...policy,
        status: updatedStatus,
        policyNumber: updatedPolicyNumber,
      };

      await updatePolicyStatus(updatedPolicy);
      navigate('/');
    } catch (error) {
      console.error('Error rejecting policy:', error);
    }
  };

  return (
    <div className="view-policy">
      <h2>View Policy</h2>
      <div className="policy-details">
        <p><strong>Policy Number:</strong> {policy.policyNumber}</p>
        <p><strong>Location Type:</strong> {policy.locationType}</p>
        <p><strong>SBU:</strong> {policy.sbu}</p>
        <p><strong>Department/Function Name:</strong> {policy.department}</p>
        <p><strong>Category:</strong> {policy.category}</p>
        <p><strong>Description:</strong> {policy.description}</p>
        <p><strong>Title:</strong> {policy.title}</p>
        <p><strong>Comments:</strong> {policy.comments}</p>

        {(userRole === 'employee' && policy.status === 'draft') ||
         (userRole === 'manager' && policy.status === 'pending') ||
         (userRole === 'head' && policy.status === 'approved') ? (
          <button className='button' onClick={() => { 
            if (userRole === 'employee') {
              handleSubmit();
            } else {
              setShowModal(true); 
              setActionType('approve'); 
            }
          }}>
            {policy.status === 'pending' ? 'Approve' : 'Submit'}
          </button>
        ) : null}
        {(userRole === 'manager' && policy.status === 'pending') ||
         (userRole === 'head' && policy.status === 'approved') ? (
          <button className='button reject' onClick={() => { setShowModal(true); setActionType('reject'); }}>
            Reject
          </button>
        ) : null}
      </div>
      <Newmod
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={actionType === 'approve' ? handleApprove : handleReject}
        policyId={policy.policyNumber} // Pass policy ID here
      />
    </div>
  );
};

export default ViewPolicy;
