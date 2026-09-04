import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds the hover elevation treatment. @default false */
  hover?: boolean;
  children?: React.ReactNode;
}

/** Surface container built on the `.pass-card` utility classes. */
export function Card(props: CardProps): JSX.Element;
