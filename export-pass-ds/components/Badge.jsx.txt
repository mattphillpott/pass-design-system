// Badge — Pass Design System primitive.
// Wraps the .pass-badge utility classes from colors_and_type.css.
export function Badge({ variant, children, ...rest }) {
  const cls = ['pass-badge', variant ? `pass-badge--${variant}` : '']
    .filter(Boolean).join(' ');
  return (
    <span className={cls} {...rest}>{children}</span>
  );
}
