import { useEffect, useState } from 'react';
import './FeatureGrid.css';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  src: string;
}

interface FeatureGridProps {
  features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;

    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

  return (
    <>
      <div className="feature-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon" aria-hidden="true">
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <button
              type="button"
              className="feature-media"
              onClick={() => setLightbox({ src: f.src, alt: f.title })}
              aria-label={`${f.title}のスクリーンショットを拡大表示`}
            >
              <img className="feature-screenshot" src={f.src} alt={f.title} loading="lazy" />
            </button>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="閉じる"
          >
            ×
          </button>
          <img
            className="lightbox-image"
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
