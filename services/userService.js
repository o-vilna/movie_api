/**
 * Service for handling user profile operations
 * @module userService
 */

/**
 * Updates user profile information
 * @async
 * @function
 * @param {string} username - Current username
 * @param {Object} updateData - Data to update
 * @param {string} [updateData.username] - New username
 * @param {string} [updateData.password] - New password
 * @param {string} [updateData.email] - New email
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} Updated user data
 * @throws {Error} When the update fails
 */
export const updateUserProfile = async (username, updateData, token) => {
  try {
    const response = await fetch(`/users/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Profile update failed: ${error.message}`);
  }
};

/**
 * Deletes a user profile
 * @async
 * @function
 * @memberof module:userService
 * @param {string} username - Username of the profile to delete
 * @param {string} token - JWT token for authentication
 * @returns {Promise<boolean>} Success status
 * @throws {Error} When the deletion fails
 */
export const deleteUserProfile = async (username, token) => {
  try {
    const response = await fetch(`/users/${username}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }

    return true;
  } catch (error) {
    throw new Error(`Profile deletion failed: ${error.message}`);
  }
}; 