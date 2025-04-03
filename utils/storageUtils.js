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