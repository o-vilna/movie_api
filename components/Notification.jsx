/**
 * Component for displaying notifications
 * @component
 */
const Notification = ({ message, type, onClose }) => {
  /**
   * Determines the CSS class based on notification type
   * @function
   * @private
   * @returns {string} CSS class name
   */
  const getNotificationClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'info':
        return 'notification-info';
      default:
        return 'notification-default';
    }
  };

  return (
    <div className={`notification ${getNotificationClass()}`}>
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="notification-close">
          ×
        </button>
      )}
    </div>
  );
};

export default Notification; 