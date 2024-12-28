import React, { useState } from 'react';
import axios from 'axios';
import './Newmod.css';

const Newmod = ({ show, onClose, onSubmit, policyId }) => {
  const [comments, setComments] = useState('');
  const userRole = localStorage.getItem('userRole'); 
  const userName = localStorage.getItem('userName'); // Assuming you store the user's name in local storage

  const submitComments = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/policies/${policyId}/comments`, { text: comments, createdBy: userName });
      console.log('Comments submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting comments:', error);
    }
  };

  const handleApprove = () => {
    if (userRole === 'manager' || userRole === 'head') {
      submitComments();
    }
    onSubmit(comments);
    setComments('');
  };

  const handleReject = () => {
    if (userRole === 'manager' || userRole === 'head') {
      submitComments();
    }
    onSubmit(comments);
    setComments('');
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {(userRole === 'manager' || userRole === 'head') && (
          <>
            <h2>Comments</h2>
            <div className="comments-section">
              <label htmlFor="comments">Comments:</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
          </>
        )}
        <div className="modal-actions">
          <button className="approve" onClick={handleApprove}>Approve</button>
          {(userRole === 'manager' || userRole === 'head') && (
            <button className="reject" onClick={handleReject}>Reject</button>
          )}
          <button className="close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Newmod;
