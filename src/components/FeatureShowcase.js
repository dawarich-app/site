import React, { useCallback, useState } from 'react';
import styles from './FeatureShowcase.module.css';
import useDialog from './useDialog';

export default function FeatureShowcase({ title, subtitle, items }) {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image, title) => {
    setModalImage({ src: image, alt: title });
  };

  const closeModal = useCallback(() => setModalImage(null), []);

  const dialogRef = useDialog(Boolean(modalImage), closeModal);

  return (
    <section className={styles.showcase}>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.grid}>
          {items.map((item, index) => (
            <div key={index} className={styles.showcaseItem}>
              {item.icon && <div className={styles.icon}>{item.icon}</div>}
              {item.title && <h3 className={styles.itemTitle}>{item.title}</h3>}
              {item.description && (
                <p className={styles.itemDescription}>{item.description}</p>
              )}
              {item.image && (
                <div className={styles.imageWrapper}>
                  {item.imageHref ? (
                    <a
                      href={item.imageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.imageLink}
                    >
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        className={styles.image}
                      />
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={styles.imageButton}
                      onClick={() => openModal(item.image, item.imageAlt || item.title)}
                      aria-label={`View ${item.imageAlt || item.title} full size`}
                    >
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        className={styles.image}
                      />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div
          className={styles.imageModal}
          onClick={closeModal}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={modalImage.alt}
        >
          <button
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Close image"
          >
            ×
          </button>
          <img
            src={modalImage.src}
            alt={modalImage.alt}
            className={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
