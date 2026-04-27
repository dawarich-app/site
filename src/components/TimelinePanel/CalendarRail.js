import React from 'react';
import styles from './CalendarRail.module.css';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function monthTitle(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function cellAriaLabel(cell) {
  if (cell.disabled && !cell.inMonth) return `${cell.date} (other month)`;
  if (cell.disabled) return `${cell.date} — no data`;
  const hours = Math.round(cell.trackedSeconds / 3600);
  return `${cell.date} — ${hours} hours tracked`;
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
  const years = [...yearStats.keys()].sort((a, b) => b - a);

  return (
    <div className={styles.rail}>
      <div className={styles.controlGroup}>
        <label className={styles.label} htmlFor="timeline-year-select">Year</label>
        <select
          id="timeline-year-select"
          className={styles.yearSelect}
          value={selectedYear ?? ''}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y} ({yearStats.get(y).totalDays} days)
            </option>
          ))}
          {years.length === 0 && <option value="">No data</option>}
        </select>
      </div>

      <div className={styles.controlGroup}>
        <label className={styles.label} htmlFor="timeline-search">Search</label>
        <input
          id="timeline-search"
          type="search"
          className={styles.searchInput}
          placeholder="Search visits…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search visits"
        />
      </div>

      {monthGrid && (
        <div className={styles.calendar}>
          <div className={styles.monthNav}>
            <button type="button" className={styles.navButton} onClick={onPrevMonth} aria-label="Previous month">
              <ChevronLeft />
            </button>
            <div className={styles.monthTitle}>{monthTitle(monthGrid.month)}</div>
            <button type="button" className={styles.navButton} onClick={onNextMonth} aria-label="Next month">
              <ChevronRight />
            </button>
          </div>

          <div className={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label, i) => <div key={i}>{label}</div>)}
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
                    aria-label={cellAriaLabel(cell)}
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
