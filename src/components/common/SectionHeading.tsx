import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`panel-heading ${className}`.trim()}>
      <div>
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
};
