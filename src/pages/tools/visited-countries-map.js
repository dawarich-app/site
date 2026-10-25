import React, { useCallback, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import { parseFile } from '@site/src/utils/heatmapUtils';
import { buildCountryIndex, countVisitedCountries } from '@site/src/utils/visitedCountries';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import ToolGuide from '@site/src/components/ToolGuide';
import VisitedCountriesMap from '@site/src/components/VisitedCountriesMap';
import RichText from '@site/src/i18n/RichText';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/visited-countries-map.json';
import heatmapStyles from './heatmap-generator.module.css';
import styles from './visited-countries-map.module.css';

const COUNTRIES_URL = '/data/countries-50m.json';
const imageUrl = 'https://dawarich.app/img/meta-image.png';

let countriesPromise = null;
function loadCountries() {
  countriesPromise ??= fetch(COUNTRIES_URL).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
  countriesPromise.catch(() => { countriesPromise = null; });
  return countriesPromise;
}

function useCountryName(htmlLang) {
  return useMemo(() => {
    const names = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames([htmlLang], { type: 'region' }) : null;
    return (country) => (country.iso && names?.of(country.iso)) || country.name;
  }, [htmlLang]);
}

export default function VisitedCountriesMapPage() {
  const pageUrl = useLocalizedUrl('/tools/visited-countries-map/');
  const htmlLang = useHtmlLang();
  const countryName = useCountryName(htmlLang);
  const [countries, setCountries] = useState(null);
  const [visits, setVisits] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const points = useRef([]);
  const number = (value) => value.toLocaleString(htmlLang);
  const { selectMessage } = usePluralForm();
  const plural = (count, message) => interpolate(selectMessage(count, message), { count: number(count) });

  const handleFiles = useCallback(async (newFiles) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = countries ?? (await loadCountries());
      setCountries(data);
      for (const file of newFiles) {
        try {
          points.current = points.current.concat(await parseFile(file));
          setFiles((current) => [...current, file.name]);
        } catch (err) {
          setError(interpolate(content.parseError, { fileName: file.name, message: err.message }));
        }
      }
      setVisits(countVisitedCountries(points.current, buildCountryIndex(data)));
    } catch {
      setError(content.loadError);
    } finally {
      setIsLoading(false);
    }
  }, [countries]);

  const handleClear = () => {
    points.current = [];
    setFiles([]);
    setVisits([]);
    setError(null);
  };

  const continents = useMemo(() => {
    const counts = new Map();
    for (const visit of visits) counts.set(visit.continent, (counts.get(visit.continent) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [visits]);

  const dateFormat = useMemo(() => new Intl.DateTimeFormat(htmlLang, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }), [htmlLang]);
  const formatDay = (day) => dateFormat.format(new Date(`${day}T00:00:00Z`));

  return (
    <Layout title={content.meta.title} description={content.meta.description}>
      <Head>
        <meta name="keywords" content={content.meta.keywords} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={content.meta.title} />
        <meta property="og:description" content={content.meta.description} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.meta.title} />
        <meta name="twitter:description" content={content.meta.description} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: content.h1,
            url: pageUrl,
            description: content.meta.description,
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          })}
        </script>
      </Head>
      <main>
        <div className={heatmapStyles.container}>
          <div className={heatmapStyles.header}>
            <h1>{content.h1}</h1>
            <p>{content.intro}</p>
          </div>

          <div className={heatmapStyles.mainContent}>
            <div className={heatmapStyles.sidebar}>
              <div className={heatmapStyles.uploadSection}>
                <h2>{content.upload.title}</h2>
                <div className={heatmapStyles.dropZone}>
                  <svg className={heatmapStyles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p>{isLoading ? content.upload.processing : content.upload.dropFiles}</p>
                  <span className={heatmapStyles.supportedFormats}>{content.upload.formats}</span>
                  <input
                    aria-label={content.upload.inputLabel}
                    type="file"
                    className={heatmapStyles.fileInput}
                    accept=".gpx,.fit,.tcx,.geojson,.json,.kml,.kmz"
                    multiple
                    disabled={isLoading}
                    onChange={(e) => e.target.files?.length && handleFiles(Array.from(e.target.files))}
                  />
                </div>
                {files.length > 0 && (
                  <div className={styles.fileRow}>
                    <span>{files.join(', ')}</span>
                    <button type="button" onClick={handleClear}>{content.upload.clear}</button>
                  </div>
                )}
                {error && <p className={styles.error} role="alert">{error}</p>}
              </div>

              {files.length > 0 && !isLoading && (
                <div className={styles.results} aria-live="polite">
                  {visits.length === 0 ? (
                    <p>{content.results.empty}</p>
                  ) : (
                    <>
                      <p className={styles.count}>{plural(visits.length, content.results.count)}</p>
                      <h2>{content.results.continentsTitle}</h2>
                      <ul className={styles.continents}>
                        {continents.map(([continent, count]) => (
                          <li key={continent}>
                            {content.continents[continent] ?? continent} <strong>{number(count)}</strong>
                          </li>
                        ))}
                      </ul>
                      <h2>{content.results.listTitle}</h2>
                      <ol className={styles.countries}>
                        {visits.map((visit) => (
                          <li key={visit.id}>
                            <span className={styles.countryName}>{countryName(visit)}</span>
                            <span className={styles.countryMeta}>
                              {visit.days > 0 ? plural(visit.days, content.results.days) : plural(visit.points, content.results.points)}
                              {visit.firstDay && ` · ${visit.firstDay === visit.lastDay ? formatDay(visit.firstDay) : interpolate(content.results.dates, { first: formatDay(visit.firstDay), last: formatDay(visit.lastDay) })}`}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              )}

              <div className={heatmapStyles.privacyNote}>
                <span>{content.privacy}</span>
              </div>
            </div>

            <div className={`${heatmapStyles.mapSection} ${styles.mapSection}`}>
              <BrowserOnly fallback={<div className={heatmapStyles.mapPlaceholder}>{content.loadingMap}</div>}>
                {() => <VisitedCountriesMap countries={countries} loadCountries={loadCountries} onLoad={setCountries} visitedIds={visits.map((v) => v.id)} />}
              </BrowserOnly>
              <p className={styles.credit}><RichText text={content.credit} /></p>
            </div>
          </div>

          {visits.length > 0 && (
            <PersonalizedCTA
              toolName="visited-countries-map"
              headline={<RichText text={interpolate(content.cta, { count: number(visits.length) })} />}
            />
          )}
        </div>

        <ToolGuide slug="visited-countries-map" title={content.h1} content={content.guide} />
        <RelatedTools slug="visited-countries-map" />
      </main>
    </Layout>
  );
}
