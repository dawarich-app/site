import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DayView from './DayView';

const day = {
  date: '2024-04-14',
  summary: {
    totalDistance: 4.7,
    distanceUnit: 'km',
    placesVisited: 1,
    timeMovingMinutes: 36,
    timeStationaryMinutes: 42,
    trackedSeconds: 4680,
  },
  bounds: { swLat: 52.5, swLng: 13.4, neLat: 52.53, neLng: 13.42 },
  entries: [
    { type: 'visit', visitId: 'v1', name: 'Café', startedAt: '2024-04-14T08:30:00Z', endedAt: '2024-04-14T09:12:00Z', duration: 42, pointCount: 1, place: { name: 'Café', lat: 52.52, lng: 13.4 }, area: null, tags: [], status: 'confirmed', searchTokens: 'café' },
    { type: 'journey', trackId: 't1', startedAt: '2024-04-14T09:12:00Z', endedAt: '2024-04-14T09:48:00Z', duration: 2160, distance: 4.7, distanceUnit: 'km', dominantMode: 'walking', avgSpeed: 7.8, speedUnit: 'km/h', coordinates: [[52.52, 13.4], [52.53, 13.41]], pointTimes: null },
  ],
};

const baseProps = {
  day,
  filteredEntries: day.entries,
  onPrevDay: () => {},
  onNextDay: () => {},
  onSelectVisit: () => {},
  onHoverEntry: () => {},
  onUnhoverEntry: () => {},
  onToggleTrack: () => {},
  selectedVisitId: null,
  expandedTrackId: null,
  replayState: null,
  onReplayChange: () => {},
};

describe('DayView', () => {
  it('renders day label', () => {
    render(<DayView {...baseProps} />);
    expect(screen.getByText(/April 14|Sun/)).toBeInTheDocument();
  });

  it('shows visit count in the meta', () => {
    render(<DayView {...baseProps} />);
    expect(screen.getByText(/1 visit/)).toBeInTheDocument();
  });

  it('renders both visit and journey entries', () => {
    render(<DayView {...baseProps} />);
    expect(screen.getByTestId('visit-row')).toBeInTheDocument();
    expect(screen.getByTestId('journey-leg')).toBeInTheDocument();
  });

  it('shows "No visits tracked this day" when entries is empty', () => {
    render(<DayView {...baseProps} day={{ ...day, entries: [] }} filteredEntries={[]} />);
    expect(screen.getByText(/No visits tracked this day/i)).toBeInTheDocument();
  });

  it('fires prev/next on day nav buttons', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(<DayView {...baseProps} onPrevDay={onPrev} onNextDay={onNext} />);
    fireEvent.click(screen.getAllByLabelText(/previous day/i)[0]);
    fireEvent.click(screen.getAllByLabelText(/next day/i)[0]);
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });

  it('shows raw-records hint when day has no entries but rawPointCount > 0', () => {
    render(<DayView {...baseProps} day={{ ...day, entries: [] }} filteredEntries={[]} rawPointCount={42} />);
    expect(screen.getByText(/raw GPS records only/i)).toBeInTheDocument();
  });
});
