import React, { useState } from 'react';
import styles from './FeatureShowcase.module.css';

export default function FeatureShowcase({ title, subtitle, items }) {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image, title) => {
    setModalImage({ src: image, alt: title });
  };

  const closeModal = () => {
    setModalImage(null);
  };

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
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    className={styles.image}
                    onClick={() => openModal(item.image, item.imageAlt || item.title)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div className={styles.imageModal} onClick={closeModal}>
          <button className={styles.closeButton} onClick={closeModal}>
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
