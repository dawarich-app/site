import React, { useCallback, useState } from 'react';
import styles from './FileUploader.module.css';

export default function PhotoUploader({ onPhotosLoaded, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => {
      const ext = f.name.toLowerCase();
      return ext.endsWith('.jpg') || ext.endsWith('.jpeg') ||
             ext.endsWith('.png') || ext.endsWith('.heic') ||
             ext.endsWith('.heif') || ext.endsWith('.tiff') ||
             ext.endsWith('.webp');
    });

    if (imageFiles.length === 0) {
      alert('No image files found. Please upload photos (JPEG, PNG, HEIC, etc.)');
      return;
    }

    setIsLoading(true);
    setLoadingMessage(`Processing ${imageFiles.length} photo${imageFiles.length !== 1 ? 's' : ''}...`);

    try {
      setFileCount(imageFiles.length);
      console.log(`[PhotoUploader] ✓ Loaded ${imageFiles.length} photos, passing to handler`);

      onPhotosLoaded(imageFiles);

      // Small delay to show completion message
      await new Promise(resolve => setTimeout(resolve, 500));

      setLoadingMessage('');
      setIsLoading(false);
    } catch (e) {
      console.error('[PhotoUploader] Error loading photos:', e);
      alert(`Error loading photos: ${e.message}`);
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [onPhotosLoaded]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleClear = useCallback(() => {
    setFileCount(0);
    onClear();
  }, [onClear]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${fileCount > 0 ? styles.hasFiles : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="photoInput"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className={styles.fileInput}
        />

        <label htmlFor="photoInput" className={styles.label}>
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              <p><strong>{loadingMessage}</strong></p>
              <p className={styles.hint}>Please wait...</p>
            </>
          ) : fileCount > 0 ? (
            <>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p><strong>{fileCount}</strong> photo{fileCount !== 1 ? 's' : ''} loaded</p>
              <p className={styles.hint}>Click or drag to add more photos</p>
            </>
          ) : (
            <>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Drop photos here</p>
              <p className={styles.hint}>or click to browse</p>
              <p className={styles.formats}>Supports: JPEG, PNG, HEIC, and other image formats</p>
            </>
          )}
        </label>
      </div>

      {fileCount > 0 && (
        <button onClick={handleClear} className={styles.clearButton}>
          Clear All Photos
        </button>
      )}
    </div>
  );
}
