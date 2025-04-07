/**
 * Utility functions for working with localStorage
 * @module storageUtils
 */

/**
 * Clears all data from localStorage
 * @function
 * @name clearStorage
 */
export const clearStorage = () => {
  localStorage.clear();
};

/**
 * Removes user authentication data from localStorage
 * @function
 * @name clearUserAuth
 */
export const clearUserAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Handles user profile deletion
 * @function
 * @description Deletes the user's profile and logs them out
 */
export const deleteUserProfile = () => {
  // Implementation of deleteUserProfile function
};

/**
 * Deletes a user profile
 * @async
 * @function
 * @param {string} username - Username of the profile to delete
 * @param {string} token - JWT token for authentication
 * @returns {Promise<boolean>} Success status
 * @throws {Error} When the deletion fails
 */
export const deleteUserProfileAsync = async (username, token) => {
  // ...
}; 