import React, { useCallback, useState } from 'react';
import styles from './FileUploader.module.css';

export default function FileUploader({ onFilesLoaded, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    const jsonFiles = fileArray.filter(f => f.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      alert('No JSON files found. Please upload Google Timeline JSON files.');
      return;
    }

    try {
      const parsedData = [];

      for (const file of jsonFiles) {
        const text = await file.text();
        const json = JSON.parse(text);
        parsedData.push({
          filename: file.name,
          data: json,
          size: file.size,
        });
      }

      if (parsedData.length > 0) {
        setFileCount(parsedData.length);
        onFilesLoaded(parsedData);
      }
    } catch (e) {
      alert(`Error loading files: ${e.message}`);
    }
  }, [onFilesLoaded]);

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
          id="fileInput"
          multiple
          accept=".json"
          onChange={handleFileInput}
          className={styles.fileInput}
        />

        <label htmlFor="fileInput" className={styles.label}>
          {fileCount > 0 ? (
            <>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p><strong>{fileCount}</strong> file{fileCount !== 1 ? 's' : ''} loaded</p>
              <p className={styles.hint}>Click or drag to add more files</p>
            </>
          ) : (
            <>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Drop Google Timeline JSON files here</p>
              <p className={styles.hint}>or click to browse</p>
              <p className={styles.formats}>Supports: Records, Semantic, Settings, TimelineEdits</p>
            </>
          )}
        </label>
      </div>

      {fileCount > 0 && (
        <button onClick={handleClear} className={styles.clearButton}>
          Clear All Files
        </button>
      )}
    </div>
  );
}
