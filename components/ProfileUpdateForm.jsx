import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/userService';
import { clearStorage } from '../utils/storageUtils';

/**
 * @component
 * @memberof Components
 * @description Component for updating and deleting user profile information
 */
const ProfileUpdateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  /**
   * Handles automatic logout after successful profile update
   * @function
   * @private
   */
  const handleAutoLogout = () => {
    setTimeout(() => {
      clearStorage();
      navigate('/login');
    }, 3000);
  };

  /**
   * Displays notification to user
   * @function
   * @private
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('success' or 'error')
   */
  const showNotification = (message, type) => {
    // Implement your notification logic here
    console.log(`${type}: ${message}`);
  };

  /**
   * Handles form submission for profile update
   * @async
   * @function
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const currentUsername = localStorage.getItem('user');

    try {
      const updatedUser = await updateUserProfile(
        currentUsername,
        formData,
        token
      );

      showNotification('Profile updated successfully!', 'success');

      // If username or password was changed, trigger auto-logout
      if (formData.username || formData.password) {
        showNotification('You will be logged out in 3 seconds...', 'info');
        handleAutoLogout();
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  /**
   * Handles input field changes
   * @function
   * @private
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles user profile deletion
   * @function
   * @memberof Components.ProfileUpdateForm
   * @description Deletes the user's profile and logs them out
   */
  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      const token = localStorage.getItem('token');
      const currentUsername = localStorage.getItem('user');
      
      try {
        const response = await fetch(`/users/${currentUsername}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          showNotification('Profile deleted successfully. You will be logged out.', 'success');
          handleAutoLogout();
        } else {
          throw new Error('Failed to delete profile');
        }
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">New Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          minLength={5}
        />
      </div>

      <div>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="button-group">
        <button type="submit">Update Profile</button>
        <button type="button" onClick={handleDeleteProfile} className="delete-button">
          Delete Profile
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm; 