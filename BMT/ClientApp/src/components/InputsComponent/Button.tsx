import React from 'react';

interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  type = 'button',
  className,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} btn_Default sales-btn-style`}
    >
      {title}
    </button>
  );
};

export default Button;
