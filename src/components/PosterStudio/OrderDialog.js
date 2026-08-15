// Order-a-print stepper with the app's exact semantics: size picker switches
// the studio layout via the normal setLayoutId path (frame refits BEFORE the
// export), steps run prepare → upload → checkout, and the checkout opens from
// a real user-clicked <a target="_blank"> — never window.open after async
// work, which popup blockers would eat.
import React, { useEffect, useRef, useState } from 'react';
import { layoutById } from '../../lib/poster-studio/data/layouts';
import { ORDERABLE_LAYOUT_IDS, printProductFor } from '../../lib/poster-studio/data/print_products';
import { orderPageUrl, runPrintOrder } from './orderFlow';
import styles from './PosterStudio.module.css';

const PRICE_MICROCOPY = 'Final price confirmed at checkout.';

export default function OrderDialog({ studio, previewRef }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('idle'); // idle | preparing | uploading | ready
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [checkout, setCheckout] = useState(null); // { checkoutUrl, token }
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const product = printProductFor(studio.layout.id);

  function reset() {
    setStep('idle');
    setProgress(0);
    setError(null);
    setCheckout(null);
  }

  function close() {
    if (busy) return;
    setOpen(false);
    reset();
  }

  function pickSize(layoutId) {
    if (busy) return;
    studio.setLayoutId(layoutId);
    reset();
  }

  async function confirm() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setCheckout(null);
    setProgress(0);
    setStep('preparing');
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await runPrintOrder({
        studio,
        previewRef,
        signal: controller.signal,
        onPrepared: () => setStep('uploading'),
        onProgress: (fraction) => setProgress(Math.round(fraction * 100)),
      });
      setCheckout(result);
      setStep('ready');
    } catch (orderError) {
      setStep('idle');
      if (orderError?.message !== 'Poster export aborted') {
        setError(orderError?.message || 'Order failed — try again.');
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className={`${styles.controlGroup} ${styles.orderOffer}`}>
        <p className={styles.orderPitch}>
          Hang it on the wall: 200 gsm matte paper, 30 × 40 to 70 × 100 cm, free EU shipping.
        </p>
        <button
          type="button"
          data-testid="order-cta"
          className={`${styles.exportButton} ${styles.orderButton}`}
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Order a print — from €44.99
        </button>
        <p className={styles.disclosure} data-testid="order-disclosure">
          Ordering uploads the finished poster PDF to Dawarich&apos;s print service; checkout runs
          on Stripe. {PRICE_MICROCOPY}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.controlGroup} data-testid="order-picker">
        <p className={styles.orderIntro}>
          Pick a print size — your poster switches to that format before export.
        </p>
        <div className={styles.sizeGrid}>
          {ORDERABLE_LAYOUT_IDS.map((layoutId) => {
            const layout = layoutById(layoutId);
            const sizeProduct = printProductFor(layoutId);
            return (
              <button
                key={layoutId}
                type="button"
                data-testid={`order-size-${layoutId}`}
                className={styles.layoutChip}
                disabled={busy}
                onClick={() => pickSize(layoutId)}
              >
                <span>{layout.dimensionsLabel}</span>
                <span className={styles.layoutDims}>{sizeProduct.priceLabel}</span>
              </button>
            );
          })}
        </div>
        <p className={styles.disclosure}>{PRICE_MICROCOPY}</p>
        <button type="button" className={styles.resetButton} onClick={close}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={styles.controlGroup} data-testid="order-dialog">
      <p className={styles.orderIntro} data-testid="order-summary">
        {studio.layout.dimensionsLabel} print — {product.priceLabel}. {PRICE_MICROCOPY}
      </p>

      {step !== 'idle' && (
        <ol className={styles.orderSteps}>
          <li className={step === 'preparing' ? styles.orderStepActive : styles.orderStepDone}>
            Preparing the print PDF…
          </li>
          <li
            className={
              step === 'uploading'
                ? styles.orderStepActive
                : step === 'ready'
                  ? styles.orderStepDone
                  : styles.orderStepPending
            }
          >
            Uploading
            {step === 'uploading' && (
              <progress data-testid="order-upload-bar" value={progress} max="100" />
            )}
          </li>
          <li className={step === 'ready' ? styles.orderStepActive : styles.orderStepPending}>
            Checkout
          </li>
        </ol>
      )}

      {error && (
        <p className={styles.exportError} data-testid="order-error" role="alert">
          {error}
        </p>
      )}

      {step === 'ready' && checkout ? (
        <div className={styles.orderActions}>
          <a
            data-testid="order-checkout-link"
            className={`${styles.exportButton} ${styles.orderButton}`}
            href={checkout.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continue to checkout
          </a>
          <a
            data-testid="order-page-link"
            className={styles.hint}
            href={orderPageUrl(checkout.token)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the order page instead
          </a>
          <button type="button" className={styles.resetButton} onClick={close}>
            Done
          </button>
        </div>
      ) : (
        <div className={styles.orderActions}>
          <button
            type="button"
            data-testid="order-confirm"
            className={`${styles.exportButton} ${styles.orderButton}`}
            disabled={busy}
            onClick={confirm}
          >
            {busy ? 'Working…' : error ? 'Retry' : 'Confirm order'}
          </button>
          <button type="button" className={styles.resetButton} disabled={busy} onClick={close}>
            Cancel
          </button>
        </div>
      )}

      <p className={styles.disclosure}>
        The finished poster PDF is uploaded to Dawarich&apos;s print service; checkout runs on
        Stripe.
      </p>
    </div>
  );
}
