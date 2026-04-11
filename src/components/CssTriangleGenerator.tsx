import { useState } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const GRID: (Direction | null)[][] = [
  ['top-left', 'up', 'top-right'],
  ['left',     null, 'right'],
  ['bottom-left', 'down', 'bottom-right'],
];

const DIR_LABEL: Record<Direction, string> = {
  up: '▲', down: '▼', left: '◀', right: '▶',
  'top-left': '◤', 'top-right': '◥', 'bottom-left': '◣', 'bottom-right': '◢',
};

function getTriangleStyle(dir: Direction, w: number, h: number, color: string): React.CSSProperties {
  const hw = Math.round(w / 2);
  const hh = Math.round(h / 2);
  const t = 'solid transparent';
  const c = `solid ${color}`;
  switch (dir) {
    case 'up':           return { width: 0, height: 0, borderLeft: `${hw}px ${t}`, borderRight: `${hw}px ${t}`, borderBottom: `${h}px ${c}` };
    case 'down':         return { width: 0, height: 0, borderLeft: `${hw}px ${t}`, borderRight: `${hw}px ${t}`, borderTop: `${h}px ${c}` };
    case 'left':         return { width: 0, height: 0, borderTop: `${hh}px ${t}`, borderBottom: `${hh}px ${t}`, borderRight: `${w}px ${c}` };
    case 'right':        return { width: 0, height: 0, borderTop: `${hh}px ${t}`, borderBottom: `${hh}px ${t}`, borderLeft: `${w}px ${c}` };
    case 'top-left':     return { width: 0, height: 0, borderTop: `${h}px ${c}`, borderRight: `${w}px ${t}` };
    case 'top-right':    return { width: 0, height: 0, borderTop: `${h}px ${c}`, borderLeft: `${w}px ${t}` };
    case 'bottom-left':  return { width: 0, height: 0, borderBottom: `${h}px ${c}`, borderRight: `${w}px ${t}` };
    case 'bottom-right': return { width: 0, height: 0, borderBottom: `${h}px ${c}`, borderLeft: `${w}px ${t}` };
  }
}

function getCssText(dir: Direction, w: number, h: number, color: string): string {
  const style = getTriangleStyle(dir, w, h, color);
  const lines = [
    'width: 0;',
    'height: 0;',
  ];
  const borderMap: Record<string, string> = {
    borderTop: 'border-top',
    borderBottom: 'border-bottom',
    borderLeft: 'border-left',
    borderRight: 'border-right',
  };
  for (const [key, val] of Object.entries(style)) {
    if (key.startsWith('border') && borderMap[key]) {
      lines.push(`${borderMap[key]}: ${val};`);
    }
  }
  return lines.join('\n');
}

export default function CssTriangleGenerator() {
  const [direction, setDirection] = useState<Direction>('up');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(80);
  const [color, setColor] = useState('#22d3ee');
  const [copied, setCopied] = useState(false);

  const cssText = getCssText(direction, width, height, color);
  const previewStyle = getTriangleStyle(direction, width, height, color);

  function handleCopy() {
    navigator.clipboard.writeText(cssText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Direction picker */}
        <div>
          <label className="block text-sm opacity-60 mb-3">Direction</label>
          <div className="grid grid-cols-3 gap-1 w-fit">
            {GRID.map((row, ri) =>
              row.map((dir, ci) =>
                dir === null ? (
                  <div key={`${ri}-${ci}`} />
                ) : (
                  <button
                    key={dir}
                    onClick={() => setDirection(dir)}
                    title={dir}
                    className="w-12 h-12 rounded-lg text-xl transition-all"
                    style={{
                      backgroundColor: direction === dir ? 'var(--color-theme-secondary)' : 'var(--color-theme-dark)',
                      color: direction === dir ? 'var(--color-theme-dark)' : 'var(--color-theme-light)',
                      border: '2px solid',
                      borderColor: direction === dir ? 'var(--color-theme-secondary)' : 'transparent',
                    }}
                  >
                    {DIR_LABEL[dir]}
                  </button>
                )
              )
            )}
          </div>
        </div>

        {/* Size & Color */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="flex justify-between text-sm opacity-60 mb-1">
              <span>Width</span>
              <span>{width}px</span>
            </label>
            <input
              type="range" min={10} max={300} value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-current"
              style={{ accentColor: 'var(--color-theme-secondary)' }}
            />
          </div>
          <div>
            <label className="flex justify-between text-sm opacity-60 mb-1">
              <span>Height</span>
              <span>{height}px</span>
            </label>
            <input
              type="range" min={10} max={300} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--color-theme-secondary)' }}
            />
          </div>
          <div>
            <label className="block text-sm opacity-60 mb-2">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color" value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                style={{ backgroundColor: 'transparent' }}
              />
              <input
                type="text" value={color}
                onChange={(e) => setColor(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm font-mono w-32 focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-theme-dark)',
                  color: 'var(--color-theme-light)',
                  border: '2px solid var(--color-theme-secondary)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm opacity-60 mb-3">Preview</label>
        <div
          className="rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-theme-dark)', minHeight: '160px' }}
        >
          <div style={previewStyle} />
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm opacity-60">CSS</label>
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1 rounded transition-all"
            style={{
              backgroundColor: copied ? 'var(--color-theme-secondary)' : 'var(--color-theme-dark)',
              color: copied ? 'var(--color-theme-dark)' : 'var(--color-theme-secondary)',
              border: '1px solid var(--color-theme-secondary)',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre
          className="rounded-xl p-4 text-sm font-mono leading-relaxed overflow-x-auto"
          style={{
            backgroundColor: 'var(--color-theme-dark)',
            color: 'var(--color-theme-secondary)',
          }}
        >
          {cssText}
        </pre>
      </div>

    </div>
  );
}
