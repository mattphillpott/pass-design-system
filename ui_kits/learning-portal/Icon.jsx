// Pass Icon — fetches an SVG from assets/icons/ and renders inline with currentColor.
// Falls back to Lucide CDN if the icon isn't in the copied-out set.

const __passIconCache = {};

function PassIcon({ name, size = 20, color = 'currentColor', style }) {
  const [svg, setSvg] = React.useState(__passIconCache[name] || null);

  React.useEffect(() => {
    if (__passIconCache[name]) return;
    let cancelled = false;
    fetch(`../../assets/icons/${name}.svg`)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        if (cancelled) return;
        __passIconCache[name] = text;
        setSvg(text);
      })
      .catch(() => {
        // Lucide fallback
        fetch(`https://unpkg.com/lucide-static@0.395.0/icons/${name}.svg`)
          .then(r => r.text())
          .then(text => { if (!cancelled) { __passIconCache[name] = text; setSvg(text); } })
          .catch(() => {});
      });
    return () => { cancelled = true; };
  }, [name]);

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex', width: size, height: size, color,
        flexShrink: 0, ...style
      }}
      dangerouslySetInnerHTML={{
        __html: (svg || '').replace(/<svg /, `<svg width="${size}" height="${size}" `)
      }}
    />
  );
}

window.PassIcon = PassIcon;
