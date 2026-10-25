import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FileUploader from './FileUploader';

if (typeof Blob.prototype.text !== 'function') {
  Blob.prototype.text = function text() {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(this);
    });
  };
}

const jsonFile = (name) => new File(['{"locations":[]}'], name, { type: 'application/json' });

describe('FileUploader', () => {
  it('should invite Google Timeline JSON files', () => {
    render(<FileUploader onFilesLoaded={() => {}} onClear={() => {}} />);
    expect(screen.getByText('Drop Google Timeline JSON files here')).toBeInTheDocument();
  });

  it('should pluralize the loaded file count and offer to clear', async () => {
    const onFilesLoaded = vi.fn();
    render(<FileUploader onFilesLoaded={onFilesLoaded} onClear={() => {}} />);
    fireEvent.change(screen.getByLabelText('Choose files to process'), {
      target: { files: [jsonFile('a.json'), jsonFile('b.json')] },
    });
    expect(await screen.findByText('Clear All Files')).toBeInTheDocument();
    await waitFor(() =>
      expect([...document.querySelectorAll('p')].map((p) => p.textContent)).toContain('2 files loaded'),
    );
    expect(onFilesLoaded).toHaveBeenCalled();
  });
});
