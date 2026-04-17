import { createContext, useContext, useState, useCallback } from 'react';

// Create the Context Context
const ToastContext = createContext();

// Custom hook for easy access
export const useToast = () => useContext(ToastContext);

// The Provider component that wraps our app
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to trigger a new toast
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random(); // Unique ID
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Manual dismiss
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Container rendering all active toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
