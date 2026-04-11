import { useRef, useEffect } from 'react';

export default function GlitchPhoto({ src, size = 208 }: { src: string; size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: any;
    let intervalId: ReturnType<typeof setInterval>;

    async function init() {
      const PIXI = await import('pixi.js');
      const { GlitchFilter } = await import('pixi-filters');

      if (!containerRef.current) return;

      app = new PIXI.Application();
      await app.init({
        width: size,
        height: size,
        backgroundAlpha: 0,
      });

      containerRef.current.appendChild(app.canvas);

      const texture = await PIXI.Assets.load(src);
      const sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);
      sprite.x = size / 2;
      sprite.y = size / 2;

      const scale = Math.max(size / texture.width, size / texture.height);
      sprite.scale.set(scale);

      const glitchFilter = new GlitchFilter({
        slices: 10,
        offset: 0,
        direction: 0,
        fillMode: 0,
        average: false,
      });

      sprite.filters = [glitchFilter];
      app.stage.addChild(sprite);

      const rand = (min: number, max: number) => Math.random() * (max - min) + min;

      intervalId = setInterval(() => {
        if (Math.random() > 0.7) {
          glitchFilter.red = { x: rand(-3, 3), y: rand(-3, 3) };
          glitchFilter.green = { x: rand(-3, 3), y: rand(-3, 3) };
          glitchFilter.blue = { x: rand(-3, 3), y: rand(-3, 3) };
          glitchFilter.slices = Math.floor(rand(3, 15));
          glitchFilter.offset = rand(0, 20);
        } else {
          glitchFilter.red = { x: 0, y: 0 };
          glitchFilter.green = { x: 0, y: 0 };
          glitchFilter.blue = { x: 0, y: 0 };
          glitchFilter.offset = 0;
        }
      }, 100);
    }

    init();

    return () => {
      clearInterval(intervalId);
      app?.destroy(true);
    };
  }, [src, size]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        overflow: 'hidden',
      }}
    />
  );
}
