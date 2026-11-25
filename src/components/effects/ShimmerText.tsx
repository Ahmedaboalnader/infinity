import React from 'react';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  children,
  className = '',
  as: Component = 'span',
}) => {
  return (
    <Component className={`text-shimmer inline-block ${className}`}>
      {children}
    </Component>
  );
};
