import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';

/**
 * LoadingOverlay component that displays a loading indicator over the screen
 * @param {Object} props - Component props
 * @param {string} [props.type='spinner'] - Type of loader: 'spinner', 'pulse', 'dots', or 'logo'
 * @param {string} [props.message='Loading...'] - Optional message to display
 * @param {boolean} [props.fullScreen=true] - Whether to cover the entire screen
 * @param {boolean} [props.transparent=true] - Whether the background should be transparent
 * @returns {JSX.Element} Loading overlay component
 */
const LoadingOverlay = ({ 
  type = 'spinner',
  message = 'Loading...',
  fullScreen = true, 
  transparent = true 
}) => {
  // Determine CSS classes based on props
  const containerClasses = `
    ${fullScreen ? 'fixed inset-0' : 'absolute inset-0'} 
    ${transparent ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} 
    z-50 flex flex-col items-center justify-center
  `;

  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return (
          <div className="relative">
            <div className="w-16 h-16 bg-indigo-600 rounded-full opacity-0 animate-ping absolute inset-0"></div>
            <div className="w-16 h-16 bg-indigo-600 rounded-full opacity-75 relative"></div>
          </div>
        );
        
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        );
        
      case 'logo':
        return (
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center transform rotate-12 animate-pulse shadow-lg">
              <FontAwesomeIcon icon={faMicrochip} className="text-white text-2xl" />
            </div>
          </div>
        );
        
      case 'spinner':
      default:
        return (
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoader()}
      {message && <p className="mt-4 text-slate-700 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingOverlay; 