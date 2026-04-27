import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JourneyLeg from './JourneyLeg';

const journey = {
  type: 'journey',
  trackId: 't1',
  startedAt: '2024-04-14T09:12:00Z',
  endedAt: '2024-04-14T09:48:00Z',
  duration: 2160,
  distance: 4.7,
  distanceUnit: 'km',
  dominantMode: 'walking',
  avgSpeed: 7.8,
  speedUnit: 'km/h',
  coordinates: [[52.52, 13.40], [52.53, 13.41]],
  pointTimes: null,
};

const baseProps = {
  entry: journey,
  isExpanded: false,
  onToggleExpand: () => {},
  onHover: () => {},
  onUnhover: () => {},
  replayState: null,
  onReplayChange: () => {},
};

describe('JourneyLeg', () => {
  it('renders mode emoji and verb', () => {
    render(<JourneyLeg {...baseProps} />);
    expect(screen.getByText('🚶')).toBeInTheDocument();
    expect(screen.getByText('walked')).toBeInTheDocument();
  });

  it('shows distance and duration', () => {
    render(<JourneyLeg {...baseProps} />);
    expect(screen.getByText(/4.7 km/)).toBeInTheDocument();
    expect(screen.getByText(/36m/)).toBeInTheDocument();
  });

  it('toggles expansion on chevron click', () => {
    const onToggle = vi.fn();
    render(<JourneyLeg {...baseProps} onToggleExpand={onToggle} />);
    fireEvent.click(screen.getByTestId('journey-leg'));
    expect(onToggle).toHaveBeenCalledWith('t1');
  });

  it('renders TrackInfoCard when isExpanded', () => {
    render(<JourneyLeg {...baseProps} isExpanded={true} />);
    expect(screen.getByText(/Track #t1/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it('starts replay on play click', () => {
    const onReplayChange = vi.fn();
    render(<JourneyLeg {...baseProps} isExpanded={true} onReplayChange={onReplayChange} />);
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    expect(onReplayChange).toHaveBeenCalledWith({ trackId: 't1', frameIndex: 0, playing: true });
  });

  it('renders the unknown mode for an unmapped activity', () => {
    render(<JourneyLeg {...baseProps} entry={{ ...journey, dominantMode: 'unknown' }} />);
    expect(screen.getByText('traveled')).toBeInTheDocument();
  });
});
