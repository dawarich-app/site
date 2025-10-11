import React, { useState, useEffect, useMemo } from 'react';
import styles from './DateFilter.module.css';

export default function DateFilter({ points, onFilterChange }) {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [dayRange, setDayRange] = useState({ start: 1, end: 31 });

  // Extract available years and months from points
  const { years, months } = useMemo(() => {
    const yearsSet = new Set();
    const monthsSet = new Set();

    points.forEach(point => {
      if (point.timestamp) {
        const date = new Date(point.timestamp);
        yearsSet.add(date.getFullYear());
        if (selectedYear !== 'all' && date.getFullYear() === parseInt(selectedYear)) {
          monthsSet.add(date.getMonth());
        }
      }
    });

    return {
      years: Array.from(yearsSet).sort((a, b) => b - a),
      months: Array.from(monthsSet).sort((a, b) => a - b),
    };
  }, [points, selectedYear]);

  // Get days in selected month
  const daysInMonth = useMemo(() => {
    if (selectedYear === 'all' || selectedMonth === 'all') {
      return 31;
    }
    return new Date(parseInt(selectedYear), parseInt(selectedMonth) + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Apply filters whenever they change
  useEffect(() => {
    const filteredPoints = points.filter(point => {
      if (!point.timestamp) return true;

      const date = new Date(point.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Year filter
      if (selectedYear !== 'all' && year !== parseInt(selectedYear)) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 'all' && month !== parseInt(selectedMonth)) {
        return false;
      }

      // Day range filter
      if (day < dayRange.start || day > dayRange.end) {
        return false;
      }

      return true;
    });

    onFilterChange(filteredPoints);
  }, [points, selectedYear, selectedMonth, dayRange, onFilterChange]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth('all');
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleDayRangeChange = (e, type) => {
    const value = parseInt(e.target.value);
    setDayRange(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleReset = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
    setDayRange({ start: 1, end: 31 });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isFiltered = selectedYear !== 'all' || selectedMonth !== 'all' ||
                     dayRange.start !== 1 || dayRange.end !== 31;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Date Filters</h3>
        {isFiltered && (
          <button onClick={handleReset} className={styles.resetButton}>
            Reset
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {/* Year filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="year-select" className={styles.label}>Year</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className={styles.select}
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="month-select" className={styles.label}>Month</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className={styles.select}
            disabled={selectedYear === 'all'}
          >
            <option value="all">All Months</option>
            {selectedYear !== 'all' && months.map(month => (
              <option key={month} value={month}>
                {monthNames[month]}
              </option>
            ))}
          </select>
        </div>

        {/* Day range filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>
            Day Range: {dayRange.start} - {dayRange.end}
          </label>
          <div className={styles.rangeContainer}>
            <div className={styles.rangeInputGroup}>
              <label htmlFor="day-start" className={styles.rangeLabel}>From</label>
              <input
                id="day-start"
                type="number"
                min="1"
                max={daysInMonth}
                value={dayRange.start}
                onChange={(e) => handleDayRangeChange(e, 'start')}
                className={styles.rangeInput}
              />
            </div>
            <div className={styles.rangeInputGroup}>
              <label htmlFor="day-end" className={styles.rangeLabel}>To</label>
              <input
                id="day-end"
                type="number"
                min={dayRange.start}
                max={daysInMonth}
                value={dayRange.end}
                onChange={(e) => handleDayRangeChange(e, 'end')}
                className={styles.rangeInput}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
