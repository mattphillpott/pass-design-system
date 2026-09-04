// PFS Icon — fetches an SVG from assets/icons/ relative to root.

const __pfsIconCache = {};

function PFSIcon({ name, size = 20, color = 'currentColor', style, strokeWidth }) {
  const [svg, setSvg] = React.useState(__pfsIconCache[name] || null);

  React.useEffect(() => {
    if (__pfsIconCache[name]) { setSvg(__pfsIconCache[name]); return; }
    let cancelled = false;
    fetch(`assets/icons/${name}.svg`)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        if (cancelled) return;
        __pfsIconCache[name] = text;
        setSvg(text);
      })
      .catch(() => {
        fetch(`https://unpkg.com/lucide-static@0.395.0/icons/${name}.svg`)
          .then(r => r.text())
          .then(text => { if (!cancelled) { __pfsIconCache[name] = text; setSvg(text); } })
          .catch(() => {});
      });
    return () => { cancelled = true; };
  }, [name]);

  return (
    <span
      aria-hidden="true"
      style={{ display: 'inline-flex', width: size, height: size, color, ...style }}
      dangerouslySetInnerHTML={{ __html: svg ? svg.replace(/(<svg\b[^>]*?)\s+width="[^"]*"/, `$1 width="${size}"`).replace(/(<svg\b[^>]*?)\s+height="[^"]*"/, `$1 height="${size}"`) : '' }}
    />
  );
}

window.PFSIcon = PFSIcon;
