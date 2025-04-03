/**
 * Context for managing notifications across the application
 * @module NotificationContext
 */

import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext(null);

/**
 * Provider component for notification management
 * @component
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Adds a new notification
   * @function
   * @param {string} message - Notification message
   * @param {string} type - Type of notification
   */
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  /**
   * Removes a notification by ID
   * @function
   * @param {number} id - Notification ID
   */
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="notifications-container">
        {notifications.map(note => (
          <Notification
            key={note.id}
            message={note.message}
            type={note.type}
            onClose={() => removeNotification(note.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

/**
 * Hook for using notifications
 * @function
 * @returns {Object} Notification functions
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}; 