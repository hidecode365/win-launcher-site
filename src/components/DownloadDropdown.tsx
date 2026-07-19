import { useEffect, useRef, useState } from 'react';
import './DownloadDropdown.css';

const RELEASES_URL = 'https://github.com/hidecode365/win-launcher/releases';
const LATEST_RELEASE_API = 'https://api.github.com/repos/hidecode365/win-launcher/releases/latest';
const CACHE_KEY = 'winlauncher-latest-release-assets';

interface ReleaseAssets {
  exeUrl: string | null;
  msiUrl: string | null;
}

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  assets: GitHubAsset[];
}

async function fetchReleaseAssets(): Promise<ReleaseAssets> {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached) as ReleaseAssets;
  }

  const res = await fetch(LATEST_RELEASE_API, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const release = (await res.json()) as GitHubRelease;
  const assets: ReleaseAssets = {
    exeUrl: release.assets.find((a) => a.name.endsWith('.exe'))?.browser_download_url ?? null,
    msiUrl: release.assets.find((a) => a.name.endsWith('.msi'))?.browser_download_url ?? null,
  };

  sessionStorage.setItem(CACHE_KEY, JSON.stringify(assets));
  return assets;
}

export default function DownloadDropdown() {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<ReleaseAssets | null>(null);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReleaseAssets()
      .then((result) => {
        if (!cancelled) setAssets(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (failed) {
    return (
      <a
        className="download-dropdown__trigger"
        href={RELEASES_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub Releasesからダウンロード
      </a>
    );
  }

  return (
    <div className="download-dropdown" ref={containerRef}>
      <button
        type="button"
        className="download-dropdown__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        GitHub Releasesからダウンロード
      </button>
      {open && (
        <div className="download-dropdown__menu" role="menu">
          <a
            role="menuitem"
            className="download-dropdown__item"
            href={assets?.exeUrl ?? RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            .exe をダウンロード(推奨)
          </a>
          <a
            role="menuitem"
            className="download-dropdown__item"
            href={assets?.msiUrl ?? RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            .msi をダウンロード(企業向け)
          </a>
          <a
            role="menuitem"
            className="download-dropdown__item download-dropdown__item--secondary"
            href={RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            その他のアセットを見る
          </a>
        </div>
      )}
    </div>
  );
}
