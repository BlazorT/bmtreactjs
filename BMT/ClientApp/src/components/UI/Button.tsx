import React, { ReactNode } from 'react';
import LoadingBtn from './LoadingBtn';

interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  loadingTitle?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  type = 'button',
  className,
  disabled = false,
  icon,
  loading = false,
  loadingTitle = '',
}: ButtonProps) => {
  return loading ? (
    <LoadingBtn title={loadingTitle} className={''} />
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} btn_Default sales-btn-style`}
    >
      {icon && icon}
      {title}
    </button>
  );
};

export default Button;
