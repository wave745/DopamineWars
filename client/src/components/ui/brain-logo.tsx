import React from 'react';

interface BrainLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const BrainLogo: React.FC<BrainLogoProps> = ({ 
  className = '', 
  size = 40, 
  color = 'hsl(142, 70%, 45%)' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`brain-logo ${className}`}
    >
      <path
        d="M9.5 2C8.9 2 8.4 2.1 8 2.3C7.2 2.7 6.5 3.4 6.2 4.3C6.1 4.7 6 5.1 6 5.5C6 5.7 6 5.9 6.1 6C5.1 6.4 4.3 7.4 4.3 8.5C4.3 9.1 4.5 9.7 4.8 10.1C4.3 10.5 4 11.2 4 12C4 12.5 4.2 13 4.4 13.3C3.7 13.7 3.3 14.4 3.3 15.2C3.3 16.2 3.9 17 4.8 17.3C4.9 18.3 5.7 19 6.7 19C7.2 19 7.7 18.8 8 18.5C8.3 18.8 8.7 19 9.2 19C10.3 19 11.2 18.1 11.2 17C11.2 16.9 11.2 16.8 11.2 16.7H12.8C12.8 16.8 12.8 16.9 12.8 17C12.8 18.1 13.7 19 14.8 19C15.3 19 15.7 18.8 16 18.5C16.3 18.8 16.8 19 17.3 19C18.3 19 19.1 18.3 19.2 17.3C20.1 17 20.8 16.2 20.8 15.2C20.8 14.4 20.4 13.7 19.6 13.3C19.9 13 20 12.5 20 12C20 11.2 19.7 10.6 19.2 10.1C19.6 9.7 19.8 9.1 19.8 8.5C19.8 7.4 19 6.4 18 6C18 5.9 18 5.7 18 5.5C18 5.1 17.9 4.7 17.8 4.3C17.5 3.4 16.8 2.7 16 2.3C15.6 2.1 15.1 2 14.5 2C13.5 2 12.7 2.4 12 3.1C11.3 2.4 10.5 2 9.5 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16H11.2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16H12.8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8H8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12H8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12H14.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BrainLogo;