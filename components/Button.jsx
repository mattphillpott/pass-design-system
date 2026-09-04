// Button — Pass Design System primitive.
// Wraps the .pass-btn utility classes from colors_and_type.css.
export function Button({ variant = 'primary', size, type = 'button', children, ...rest }) {
  const cls = ['pass-btn', `pass-btn--${variant}`, size ? `pass-btn--${size}` : '']
    .filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>{children}</button>
  );
}
