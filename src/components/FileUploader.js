import React, { useCallback, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import { usePluralForm } from '@docusaurus/theme-common';
import RichText from '@site/src/i18n/RichText';
import styles from './FileUploader.module.css';

export default function FileUploader({ onFilesLoaded, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileCount, setFileCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { selectMessage } = usePluralForm();

  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files);
    const jsonFiles = fileArray.filter(f => f.name.endsWith('.json'));

    if (jsonFiles.length === 0) {
      alert(translate({ id: 'shared.uploader.noJson', message: 'No JSON files found. Please upload Google Timeline JSON files.' }));
      return;
    }

    setIsLoading(true);

    try {
      const parsedData = [];

      for (let i = 0; i < jsonFiles.length; i++) {
        const file = jsonFiles[i];
        setLoadingMessage(
          translate(
            { id: 'shared.uploader.reading', message: 'Reading file {current}/{total}: {name}' },
            { current: i + 1, total: jsonFiles.length, name: file.name },
          ),
        );
        console.log(`[FileUploader] Reading ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

        const text = await file.text();

        setLoadingMessage(
          translate(
            { id: 'shared.uploader.parsing', message: 'Parsing file {current}/{total}: {name}' },
            { current: i + 1, total: jsonFiles.length, name: file.name },
          ),
        );
        const json = JSON.parse(text);

        parsedData.push({
          filename: file.name,
          data: json,
          size: file.size,
          blob: file,
        });
      }

      if (parsedData.length > 0) {
        setLoadingMessage(translate({ id: 'shared.uploader.processing', message: 'Processing timeline data...' }));
        setFileCount(parsedData.length);

        console.log(`[FileUploader] ✓ Loaded ${parsedData.length} files, passing to handler`);
        onFilesLoaded(parsedData);

        // Small delay to show completion message
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setLoadingMessage('');
      setIsLoading(false);
    } catch (e) {
      console.error('[FileUploader] Error loading files:', e);
      alert(
        translate({ id: 'shared.uploader.loadError', message: 'Error loading files: {message}' }, { message: e.message }),
      );
      setIsLoading(false);
      setLoadingMessage('');
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
          aria-label={translate({ id: 'shared.uploader.chooseFiles', message: 'Choose files to process' })}
          type="file"
          id="fileInput"
          multiple
          accept=".json"
          onChange={handleFileInput}
          className={styles.fileInput}
        />

        <label htmlFor="fileInput" className={styles.label}>
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              <p><strong>{loadingMessage}</strong></p>
              <p className={styles.hint}>{translate({ id: 'shared.uploader.wait', message: 'Please wait...' })}</p>
            </>
          ) : fileCount > 0 ? (
            <>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>
                <RichText
                  text={selectMessage(
                    fileCount,
                    translate(
                      { id: 'shared.uploader.loaded', message: '**{count}** file loaded|**{count}** files loaded' },
                      { count: fileCount },
                    ),
                  )}
                />
              </p>
              <p className={styles.hint}>
                {translate({ id: 'shared.uploader.addMore', message: 'Click or drag to add more files' })}
              </p>
            </>
          ) : (
            <>
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>{translate({ id: 'shared.uploader.dropPrompt', message: 'Drop Google Timeline JSON files here' })}</p>
              <p className={styles.hint}>{translate({ id: 'shared.uploader.browse', message: 'or click to browse' })}</p>
              <p className={styles.formats}>
                {translate(
                  { id: 'shared.uploader.supports', message: 'Supports: {formats}' },
                  { formats: 'Records, Semantic, Semantic Segments, Settings, TimelineEdits, Location History' },
                )}
              </p>
            </>
          )}
        </label>
      </div>

      {fileCount > 0 && (
        <button onClick={handleClear} className={styles.clearButton}>
          {translate({ id: 'shared.uploader.clearAll', message: 'Clear All Files' })}
        </button>
      )}
    </div>
  );
}
