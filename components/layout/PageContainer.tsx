// Reusable layout container — use on every page section
// className prop allows overriding or adding classes
import { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean; // max-w-4xl for text-heavy sections
  as?: 'div' | 'section' | 'article';
}

export default function PageContainer({ children, className = '', narrow = false, as: Tag = 'div' }: PageContainerProps) {
  return (
    <Tag className={`page-container ${narrow ? 'max-w-4xl' : ''} ${className}`}>
      {children}
    </Tag>
  );
}
