import { useEffect, useRef, useState } from 'react';
import './CopyCommandButton.css';

interface CopyCommandButtonProps {
  command: string;
  label: string;
  copiedLabel?: string;
  variant?: 'primary' | 'compact';
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export default function CopyCommandButton({
  command,
  label,
  copiedLabel = 'コピーしました',
  variant = 'primary',
}: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  async function handleClick() {
    try {
      await copyToClipboard(command);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードAPIが使えない環境では何もしない
    }
  }

  return (
    <button
      type="button"
      className={`copy-btn copy-btn--${variant}${copied ? ' is-copied' : ''}`}
      onClick={handleClick}
    >
      <span className="copy-btn__icon" aria-hidden="true">
        {copied ? '✓' : '⧉'}
      </span>
      <span className="copy-btn__label">{copied ? copiedLabel : label}</span>
    </button>
  );
}
