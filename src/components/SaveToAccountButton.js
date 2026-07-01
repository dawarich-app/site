import React, { useState } from 'react';
import styles from './SaveToAccountButton.module.css';

const API_BASE = 'https://my.dawarich.app';

const ERROR_MESSAGES = {
  413: 'Your file is too large for instant import. Sign up first, then upload from your dashboard.',
  429: 'Too many uploads from your network. Please try again in an hour.',
  default: 'Upload failed. Please try again.',
};

export default function SaveToAccountButton({ toolName, sourceHint, getFiles, disabled }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setBusy(true);
    setError(null);

    try {
      const files = await getFiles();
      if (!files || files.length === 0) {
        setError('No files to save. Upload a file first.');
        return;
      }

      const { bundleFiles } = await import('@site/src/utils/bundleFiles');
      const bundle = await bundleFiles(files);
      const originalFilename = files.length === 1 ? `${files[0].name}.zip` : bundle.filename;

      const form = new FormData();
      form.append('file', bundle.blob, originalFilename);
      form.append('original_filename', originalFilename);
      if (sourceHint) {
        form.append('source_hint', sourceHint);
      }

      const response = await fetch(`${API_BASE}/api/v1/imports/pending`, {
        method: 'POST',
        body: form,
      });

      if (response.status === 201) {
        const data = await response.json();
        window.location.href = `${data.claim_url}&utm_campaign=${encodeURIComponent(toolName)}`;
        return;
      }

      setError(ERROR_MESSAGES[response.status] || ERROR_MESSAGES.default);
    } catch (e) {
      console.error('[SaveToAccountButton] Upload failed:', e);
      setError(ERROR_MESSAGES.default);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        disabled={disabled || busy}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
        {busy ? 'Uploading…' : 'Save to my Dawarich account'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
