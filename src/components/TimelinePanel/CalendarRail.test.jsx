import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarRail from './CalendarRail';

const monthGrid = {
  year: 2024,
  month: '2024-04',
  weeks: Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const dayNum = w * 7 + d - 0;
      const inMonth = dayNum >= 0 && dayNum < 30;
      const date = `2024-04-${String(Math.max(1, Math.min(30, dayNum + 1))).padStart(2, '0')}`;
      return {
        date,
        inMonth,
        heatBucket: dayNum === 13 ? 5 : 0,
        trackedSeconds: dayNum === 13 ? 36000 : 0,
        suggestedCount: 0,
        disabled: !inMonth || dayNum !== 13,
      };
    })
  ),
};

const baseProps = {
  monthGrid,
  selectedDate: '2024-04-14',
  selectedYear: 2024,
  yearStats: new Map([[2024, { months: new Set(['2024-04']), totalDays: 1, busiestSeconds: 36000 }]]),
  searchQuery: '',
  onYearChange: () => {},
  onSearchChange: () => {},
  onSelectDay: () => {},
  onPrevMonth: () => {},
  onNextMonth: () => {},
};

describe('CalendarRail', () => {
  it('renders month title', () => {
    render(<CalendarRail {...baseProps} />);
    expect(screen.getByText(/April 2024/i)).toBeInTheDocument();
  });

  it('shows year select with available years', () => {
    render(<CalendarRail {...baseProps} />);
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
  });

  it('marks the selected day cell', () => {
    render(<CalendarRail {...baseProps} />);
    const cell = screen.getByLabelText(/2024-04-14/i);
    expect(cell.className).toMatch(/selected/i);
  });

  it('fires onSelectDay when an enabled cell is clicked', () => {
    const onSelectDay = vi.fn();
    render(<CalendarRail {...baseProps} onSelectDay={onSelectDay} />);
    fireEvent.click(screen.getByLabelText(/2024-04-14/i));
    expect(onSelectDay).toHaveBeenCalledWith('2024-04-14');
  });

  it('fires onSearchChange when typing in search', () => {
    const onSearchChange = vi.fn();
    render(<CalendarRail {...baseProps} onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'café' } });
    expect(onSearchChange).toHaveBeenCalledWith('café');
  });

  it('fires onPrevMonth and onNextMonth on month nav', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(<CalendarRail {...baseProps} onPrevMonth={onPrev} onNextMonth={onNext} />);
    fireEvent.click(screen.getByLabelText(/previous month/i));
    fireEvent.click(screen.getByLabelText(/next month/i));
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });
});
