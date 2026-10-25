import React from 'react';
import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/components/CalendarRail.json';
import styles from './CalendarRail.module.css';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';

const WEEKDAY_LABELS = content.weekdays;

function monthTitle(monthKey, htmlLang) {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(htmlLang, { month: 'long', year: 'numeric' });
}

function cellAriaLabel(cell, htmlLang) {
  if (cell.disabled && !cell.inMonth) return interpolate(content.otherMonth, { date: cell.date });
  if (cell.disabled) return interpolate(content.noData, { date: cell.date });
  const hours = Math.round(cell.trackedSeconds / 3600);
  return interpolate(content.hoursTracked, { date: cell.date, hours: hours.toLocaleString(htmlLang) });
}

function ChevronLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function CalendarRail({
  monthGrid,
  selectedDate,
  selectedYear,
  yearStats,
  searchQuery,
  onYearChange,
  onSearchChange,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) {
  const htmlLang = useHtmlLang();
  const years = [...yearStats.keys()].sort((a, b) => b - a);

  return (
    <div className={styles.rail}>
      <div className={styles.controlGroup}>
        <label className={styles.label} htmlFor="timeline-year-select">{content.yearLabel}</label>
        <select
          id="timeline-year-select"
          className={styles.yearSelect}
          value={selectedYear ?? ''}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {interpolate(content.yearDays, { year: y, count: yearStats.get(y).totalDays.toLocaleString(htmlLang) })}
            </option>
          ))}
          {years.length === 0 && <option value="">{content.emptyLabel}</option>}
        </select>
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.label} htmlFor="timeline-search">{content.searchLabel}</label>
        <input
          id="timeline-search"
          type="search"
          className={styles.searchInput}
          placeholder={content.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={content.searchAriaLabel}
        />
      </div>

      {monthGrid && (
        <div className={styles.calendar}>
          <div className={styles.monthNav}>
            <button type="button" className={styles.navButton} onClick={onPrevMonth} aria-label={content.previousMonth}>
              <ChevronLeft />
            </button>
            <div className={styles.monthTitle}>{monthTitle(monthGrid.month, htmlLang)}</div>
            <button type="button" className={styles.navButton} onClick={onNextMonth} aria-label={content.nextMonth}>
              <ChevronRight />
            </button>
          </div>

          <div className={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((day, i) => <div key={i}>{day.label}</div>)}
          </div>

          {monthGrid.weeks.map((week, wi) => (
            <div key={wi} className={styles.weekRow}>
              {week.map((cell) => {
                const dayNum = Number(cell.date.slice(-2));
                const cn = [
                  styles.cell,
                  styles[`heat${cell.heatBucket}`],
                  cell.inMonth ? '' : styles.cellOutOfMonth,
                  cell.disabled ? styles.cellDisabled : '',
                  cell.date === selectedDate ? styles.cellSelected : '',
                ].filter(Boolean).join(' ');
                return (
                  <button
                    key={cell.date}
                    type="button"
                    className={cn}
                    disabled={cell.disabled}
                    onClick={() => onSelectDay(cell.date)}
                    aria-label={cellAriaLabel(cell, htmlLang)}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
