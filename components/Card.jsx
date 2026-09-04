// Card — Pass Design System primitive.
// Wraps the .pass-card utility classes from colors_and_type.css.
export function Card({ hover = false, children, className = '', ...rest }) {
  const cls = ['pass-card', hover ? 'pass-card--hover' : '', className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>{children}</div>
  );
}
