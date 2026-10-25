import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import FormatConverter from './FormatConverter';

describe('FormatConverter', () => {
  it('should prompt for the source format', () => {
    render(<FormatConverter fromFormat="GPX" toFormat="KML" onConvert={() => {}} />);
    expect(screen.getByText('Drag and drop your GPX file here, or click to browse')).toBeInTheDocument();
  });

  it('should offer conversion to the target format once a file is chosen', () => {
    const onConvert = vi.fn();
    render(<FormatConverter fromFormat="GPX" toFormat="KML" onConvert={onConvert} />);
    const file = new File(['<gpx/>'], 'track.gpx', { type: 'application/gpx+xml' });
    fireEvent.change(screen.getByLabelText('Choose files to process'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /Convert to KML/ }));
    expect(onConvert).toHaveBeenCalledWith(file);
  });

  it('should show progress while converting', () => {
    render(<FormatConverter fromFormat="GPX" toFormat="KML" onConvert={() => {}} isConverting />);
    const file = new File(['<gpx/>'], 'track.gpx');
    fireEvent.change(screen.getByLabelText('Choose files to process'), { target: { files: [file] } });
    expect(screen.getByRole('button', { name: /Converting/ })).toBeDisabled();
  });
});
