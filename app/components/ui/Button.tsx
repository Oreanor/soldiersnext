import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'px-2 py-1 text-xs rounded cursor-pointer w-fit border transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 