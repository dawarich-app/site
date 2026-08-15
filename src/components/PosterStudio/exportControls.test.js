import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

const { renderMock, downloadMock } = vi.hoisted(() => ({
  renderMock: vi.fn(),
  downloadMock: vi.fn(),
}));

vi.mock('maplibre-gl', () => ({ default: {} }));
vi.mock('./posterExport', () => ({ renderAndEncodePoster: renderMock }));
vi.mock('../../lib/poster-studio/export/download', () => ({
  downloadBlob: downloadMock,
  pngBlob: (bytes) => ({ bytes, type: 'image/png' }),
  pdfBlob: (bytes) => ({ bytes, type: 'application/pdf' }),
  posterFilename: () => 'unused',
}));

import { usePosterStudio } from './usePosterStudio';
import ExportControls from './ExportControls';

const FAKE_MAP = {
  getBounds: () => 'MAP_BOUNDS',
  getCenter: () => ({ lat: 51.3402, lng: 12.3712 }),
};
const FAKE_FRAME = { clientWidth: 420, clientHeight: 594 };
const previewRef = { current: { getMap: () => FAKE_MAP, getFrame: () => FAKE_FRAME } };

function Harness({ layoutId }) {
  const studio = usePosterStudio({ type: 'FeatureCollection', features: [] });
  React.useEffect(() => {
    if (layoutId) studio.setLayoutId(layoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutId]);
  return <ExportControls studio={studio} previewRef={previewRef} />;
}

beforeEach(() => {
  renderMock.mockReset();
  downloadMock.mockReset();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => ({ bg: '#fff', text: '#000' }) })),
  );
});

describe('ExportControls', () => {
  it('exports a PNG with the state dpi and the frame css size', async () => {
    renderMock.mockResolvedValue({
      blob: { type: 'image/png' },
      extension: 'png',
      geometry: { steppedDown: false },
    });
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());

    fireEvent.click(screen.getByTestId('export-png'));
    await waitFor(() => expect(downloadMock).toHaveBeenCalledTimes(1));

    const args = renderMock.mock.calls[0][0];
    expect(args.format).toBe('png');
    expect(args.dpi).toBe(300);
    expect(args.bounds).toBe('MAP_BOUNDS');
    expect(args.cssSize).toEqual({ width: 420, height: 594 });
    expect(args.text.attribution).toBeUndefined();
    expect(downloadMock.mock.calls[0][1]).toBe('dawarich-berlin-print-a3.png');
  });

  it('hides the PDF button for pixel layouts', async () => {
    render(<Harness layoutId="social-story" />);
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());
    expect(screen.queryByTestId('export-pdf')).toBeNull();
  });

  it('shows the PDF button for paper layouts and passes format pdf', async () => {
    renderMock.mockResolvedValue({
      blob: { type: 'application/pdf' },
      extension: 'pdf',
      geometry: { steppedDown: false },
    });
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('export-pdf')).toBeEnabled());

    fireEvent.click(screen.getByTestId('export-pdf'));
    await waitFor(() => expect(downloadMock).toHaveBeenCalled());
    expect(renderMock.mock.calls[0][0].format).toBe('pdf');
  });

  it('ignores clicks while an export is busy', async () => {
    let resolveExport;
    renderMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveExport = resolve;
        }),
    );
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());

    fireEvent.click(screen.getByTestId('export-png'));
    fireEvent.click(screen.getByTestId('export-png'));
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('export-png')).toBeDisabled();

    await act(async () => {
      resolveExport({ blob: {}, extension: 'png', geometry: { steppedDown: false } });
    });
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());
  });

  it('surfaces the print upsell after a successful download', async () => {
    renderMock.mockResolvedValue({
      blob: { type: 'image/png' },
      extension: 'png',
      geometry: { steppedDown: false },
    });
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());
    expect(screen.queryByTestId('export-upsell')).toBeNull();

    fireEvent.click(screen.getByTestId('export-png'));
    await waitFor(() => expect(screen.getByTestId('export-upsell')).toBeInTheDocument());
    expect(screen.getByTestId('export-upsell').textContent).toMatch(/200 gsm/);
  });

  it('surfaces a stepped-down notice after a clamped export', async () => {
    renderMock.mockResolvedValue({
      blob: {},
      extension: 'png',
      geometry: { steppedDown: true, effectiveDpi: 124 },
    });
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());

    fireEvent.click(screen.getByTestId('export-png'));
    await waitFor(() => expect(screen.getByTestId('export-notice')).toBeInTheDocument());
    expect(screen.getByTestId('export-notice').textContent).toMatch(/maximum resolution/i);
    expect(screen.getByTestId('export-notice').textContent).toContain('124 DPI');
  });

  it('shows an inline error instead of crashing when the export fails', async () => {
    renderMock.mockRejectedValue(new Error('export produced a blank canvas'));
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('export-png')).toBeEnabled());

    fireEvent.click(screen.getByTestId('export-png'));
    await waitFor(() => expect(screen.getByTestId('export-error')).toBeInTheDocument());
    expect(screen.getByTestId('export-error').textContent).toContain('blank canvas');
    expect(downloadMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('export-png')).toBeEnabled();
  });
});
