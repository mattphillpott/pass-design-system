import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic colour; omit for the neutral grey badge. */
  variant?: 'success' | 'warning' | 'danger' | 'brand';
  children?: React.ReactNode;
}

/** Pill badge built on the `.pass-badge` utility classes. */
export function Badge(props: BadgeProps): JSX.Element;
