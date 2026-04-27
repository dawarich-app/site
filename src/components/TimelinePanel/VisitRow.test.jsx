import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VisitRow from './VisitRow';

const visit = {
  type: 'visit',
  visitId: 'v1',
  name: 'Café Nero',
  startedAt: '2024-04-14T08:30:00Z',
  endedAt: '2024-04-14T09:12:00Z',
  duration: 42,
  pointCount: 3,
  place: { name: 'Café Nero', lat: 52.52, lng: 13.40 },
  area: null,
  tags: [],
  status: 'confirmed',
  searchTokens: 'café nero',
};

describe('VisitRow', () => {
  it('renders visit name and duration', () => {
    render(<VisitRow entry={visit} onSelect={() => {}} onHover={() => {}} onUnhover={() => {}} isSelected={false} />);
    expect(screen.getByText('Café Nero')).toBeInTheDocument();
    expect(screen.getByText(/42m/)).toBeInTheDocument();
    expect(screen.getByText(/3 pts/)).toBeInTheDocument();
  });

  it('fires onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<VisitRow entry={visit} onSelect={onSelect} onHover={() => {}} onUnhover={() => {}} isSelected={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('v1');
  });

  it('applies the selected class when isSelected is true', () => {
    const { container } = render(<VisitRow entry={visit} onSelect={() => {}} onHover={() => {}} onUnhover={() => {}} isSelected={true} />);
    expect(container.firstChild.className).toMatch(/selected/i);
  });

  it('renders "All day" for visits ≥23 hours', () => {
    const allDay = { ...visit, duration: 23 * 60 + 5 };
    render(<VisitRow entry={allDay} onSelect={() => {}} onHover={() => {}} onUnhover={() => {}} isSelected={false} />);
    expect(screen.getByText(/All day/i)).toBeInTheDocument();
  });
});
