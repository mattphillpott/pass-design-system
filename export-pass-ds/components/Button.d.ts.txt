import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Optional size override; omit for the default 40px height. */
  size?: 'sm' | 'lg';
  children?: React.ReactNode;
}

/** Pass button built on the `.pass-btn` utility classes. */
export function Button(props: ButtonProps): JSX.Element;
