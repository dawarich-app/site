import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const { renderMock, submitMock } = vi.hoisted(() => ({
  renderMock: vi.fn(),
  submitMock: vi.fn(),
}));

vi.mock('maplibre-gl', () => ({ default: {} }));
vi.mock('./posterExport', () => ({ renderAndEncodePoster: renderMock }));
vi.mock('../../lib/poster-studio/ui/order_client', () => ({ submitPrintOrder: submitMock }));

import { usePosterStudio } from './usePosterStudio';
import OrderDialog from './OrderDialog';

const FAKE_MAP = {
  getBounds: () => ({
    getWest: () => 12.3,
    getSouth: () => 51.3,
    getEast: () => 12.4,
    getNorth: () => 51.4,
  }),
  getCenter: () => ({ lat: 51.3402, lng: 12.3712 }),
};
const FAKE_FRAME = { clientWidth: 420, clientHeight: 560 };
const previewRef = { current: { getMap: () => FAKE_MAP, getFrame: () => FAKE_FRAME } };

function Harness({ initialLayoutId }) {
  const studio = usePosterStudio({ type: 'FeatureCollection', features: [] });
  React.useEffect(() => {
    if (initialLayoutId) studio.setLayoutId(initialLayoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <pre data-testid="state">
        {JSON.stringify({ layoutId: studio.layoutId, ready: Boolean(studio.style) })}
      </pre>
      <OrderDialog studio={studio} previewRef={previewRef} />
    </div>
  );
}

const state = () => JSON.parse(screen.getByTestId('state').textContent);

const waitForStudioReady = () => waitFor(() => expect(state().ready).toBe(true));

beforeEach(() => {
  renderMock.mockReset();
  submitMock.mockReset();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => ({ bg: '#fff', text: '#000' }) })),
  );
});

describe('OrderDialog', () => {
  it('walks the happy path to a user-clicked checkout link and backstop', async () => {
    renderMock.mockResolvedValue({ blob: { type: 'application/pdf' }, extension: 'pdf', geometry: {} });
    submitMock.mockResolvedValue({ token: 'tok_test', checkoutUrl: 'https://example.com/checkout' });

    render(<Harness initialLayoutId="print-30x40" />);
    await waitForStudioReady();
    fireEvent.click(screen.getByTestId('order-cta'));

    expect(screen.getByTestId('order-summary').textContent).toContain('€44.99');
    expect(screen.getByTestId('order-summary').textContent).toContain('Final price confirmed at checkout');

    fireEvent.click(screen.getByTestId('order-confirm'));
    await waitFor(() => expect(screen.getByTestId('order-checkout-link')).toHaveAttribute('href'));

    const checkout = screen.getByTestId('order-checkout-link');
    expect(checkout).toHaveAttribute('href', 'https://example.com/checkout');
    expect(checkout).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('order-page-link')).toHaveAttribute(
      'href',
      'https://prints.dawarich.app/orders/tok_test',
    );

    const exportArgs = renderMock.mock.calls[0][0];
    expect(exportArgs.dpi).toBe(300);
    expect(exportArgs.format).toBe('pdf');
    expect(exportArgs.bounds).toEqual([
      [12.3, 51.3],
      [12.4, 51.4],
    ]);

    const submitArgs = submitMock.mock.calls[0][0];
    expect(submitArgs.url).toBe('https://prints.dawarich.app/api/orders');
    expect(submitArgs.sku).toBe('poster-30x40');
  });

  it('shows the size picker for non-orderable layouts and switches the layout before any export', async () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('order-cta'));

    expect(screen.getByTestId('order-picker')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^order-size-/)).toHaveLength(3);
    expect(screen.getByTestId('order-size-print-50x70').textContent).toContain('€54.99');

    fireEvent.click(screen.getByTestId('order-size-print-30x40'));
    expect(state().layoutId).toBe('print-30x40');
    expect(renderMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
  });

  it('drives the upload bar from progress fractions', async () => {
    renderMock.mockResolvedValue({ blob: {}, extension: 'pdf', geometry: {} });
    let capturedProgress;
    let resolveSubmit;
    submitMock.mockImplementation(({ onProgress }) => {
      capturedProgress = onProgress;
      return new Promise((resolve) => {
        resolveSubmit = resolve;
      });
    });

    render(<Harness initialLayoutId="print-30x40" />);
    await waitForStudioReady();
    fireEvent.click(screen.getByTestId('order-cta'));
    fireEvent.click(screen.getByTestId('order-confirm'));

    await waitFor(() => expect(submitMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('order-upload-bar')).toBeInTheDocument());
    capturedProgress(0.5);
    await waitFor(() => expect(screen.getByTestId('order-upload-bar')).toHaveValue(50));

    resolveSubmit({ token: 't', checkoutUrl: 'https://example.com/c' });
    await waitFor(() => expect(screen.getByTestId('order-checkout-link')).toHaveAttribute('href'));
  });

  it('surfaces mapped server errors inline and allows retrying', async () => {
    renderMock.mockResolvedValue({ blob: {}, extension: 'pdf', geometry: {} });
    submitMock.mockRejectedValue(
      new Error("The exported PDF doesn't match the selected format — try again."),
    );

    render(<Harness initialLayoutId="print-30x40" />);
    await waitForStudioReady();
    fireEvent.click(screen.getByTestId('order-cta'));
    fireEvent.click(screen.getByTestId('order-confirm'));

    await waitFor(() => expect(screen.getByTestId('order-error')).toBeInTheDocument());
    expect(screen.getByTestId('order-error').textContent).toContain("doesn't match the selected format");
    expect(screen.getByTestId('order-confirm')).toBeEnabled();
  });

  it('aborts before any upload when the render comes back blank', async () => {
    renderMock.mockRejectedValue(new Error('The export produced a blank canvas'));

    render(<Harness initialLayoutId="print-30x40" />);
    await waitForStudioReady();
    fireEvent.click(screen.getByTestId('order-cta'));
    fireEvent.click(screen.getByTestId('order-confirm'));

    await waitFor(() => expect(screen.getByTestId('order-error')).toBeInTheDocument());
    expect(screen.getByTestId('order-error').textContent).toContain('blank canvas');
    expect(submitMock).not.toHaveBeenCalled();
  });

  it('ignores a second confirm while busy', async () => {
    renderMock.mockImplementation(() => new Promise(() => {}));

    render(<Harness initialLayoutId="print-30x40" />);
    await waitForStudioReady();
    fireEvent.click(screen.getByTestId('order-cta'));
    fireEvent.click(screen.getByTestId('order-confirm'));
    fireEvent.click(screen.getByTestId('order-confirm'));

    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  it('discloses the upload and Stripe checkout next to the CTA', () => {
    render(<Harness initialLayoutId="print-30x40" />);
    expect(screen.getByTestId('order-disclosure').textContent).toMatch(/uploads the finished poster PDF/i);
    expect(screen.getByTestId('order-disclosure').textContent).toMatch(/Stripe/);
  });
});
