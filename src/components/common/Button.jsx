import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", isLoading, className = "" }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : children}
    </button>
  );
};

export default Button;