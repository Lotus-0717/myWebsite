import { useState, useEffect, useCallback } from 'react';

interface Props {
  images: string[];
  alt?: string;
}

export default function ImageGallery({ images, alt = '' }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, close, prev, next]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="aspect-video rounded-xl overflow-hidden block w-full focus:outline-none focus-visible:ring-2"
            style={{ '--tw-ring-color': 'var(--color-theme-secondary)' } as React.CSSProperties}
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={close}
        >
          <button
            className="absolute top-4 right-5 text-white text-3xl leading-none opacity-70 hover:opacity-100"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-3 sm:left-6 text-white text-3xl opacity-70 hover:opacity-100 p-2"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                className="absolute right-3 sm:right-6 text-white text-3xl opacity-70 hover:opacity-100 p-2"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}

          <img
            src={images[lightboxIndex]}
            alt={`${alt} ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 text-white text-sm opacity-50">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
