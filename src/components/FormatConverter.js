import React, { useState, useCallback } from 'react';
import styles from './FormatConverter.module.css';

export default function FormatConverter({
  fromFormat,
  toFormat,
  onConvert,
  isConverting = false
}) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleConvert = () => {
    if (file && onConvert) {
      onConvert(file);
    }
  };

  const handleClear = () => {
    setFile(null);
  };

  const acceptedFormats = {
    'GPX': '.gpx',
    'GeoJSON': '.geojson,.json',
    'KML': '.kml',
    'KMZ': '.kmz'
  };

  return (
    <div className={styles.converter}>
      <div className={styles.uploadSection}>
        <div
          className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className={styles.dropText}>
                Drag and drop your {fromFormat} file here, or click to browse
              </p>
              <input
                type="file"
                className={styles.fileInput}
                accept={acceptedFormats[fromFormat]}
                onChange={handleChange}
              />
            </>
          ) : (
            <div className={styles.fileInfo}>
              <svg className={styles.fileIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileSize}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={handleClear}
                className={styles.clearButton}
                type="button"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {file && (
          <button
            onClick={handleConvert}
            className={styles.convertButton}
            disabled={isConverting}
          >
            {isConverting ? (
              <>
                <svg className={styles.spinner} viewBox="0 0 24 24">
                  <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Converting...
              </>
            ) : (
              <>
                Convert to {toFormat}
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
