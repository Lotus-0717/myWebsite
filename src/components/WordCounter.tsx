import { useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-48 p-4 rounded-lg resize-y focus:outline-none"
        style={{
          backgroundColor: 'var(--color-theme-dark)',
          color: 'var(--color-theme-light)',
          borderWidth: '2px',
          borderColor: 'var(--color-theme-secondary)',
        }}
      />
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {[
          { value: charCount, label: 'Characters' },
          { value: charNoSpaces, label: 'Characters (no spaces)' },
          { value: wordCount, label: 'Words' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-theme-dark)' }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: 'var(--color-theme-secondary)' }}
            >
              {stat.value}
            </div>
            <div className="text-sm opacity-60">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
