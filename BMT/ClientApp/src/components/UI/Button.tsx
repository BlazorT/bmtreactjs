import React, { ReactNode } from 'react';
import LoadingBtn from './LoadingBtn';

interface ButtonProps {
  title: string;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  content?: string;
  disabled?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
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
  children,
  content,
}: ButtonProps) => {
  return loading ? (
    <LoadingBtn title={loadingTitle} className={''} />
  ) : (
    <button
      title={content}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` btn_Default sales-btn-style ${className}`}
    >
      {children ? (
        children
      ) : (
        <>
          {icon && icon}
          {title}
        </>
      )}
    </button>
  );
};

export default Button;
