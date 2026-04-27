import React from 'react';
import CalendarRail from './CalendarRail';
import DayView from './DayView';
import styles from './TimelinePanel.module.css';

export default function TimelinePanel({
  monthGrid,
  selectedDate,
  selectedYear,
  yearStats,
  searchQuery,
  day,
  filteredEntries,
  rawPointCount,
  selectedVisitId,
  expandedTrackId,
  replayState,
  onYearChange,
  onSearchChange,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onPrevDay,
  onNextDay,
  onSelectVisit,
  onHoverEntry,
  onUnhoverEntry,
  onToggleTrack,
  onReplayChange,
}) {
  return (
    <div className={styles.panel}>
      <CalendarRail
        monthGrid={monthGrid}
        selectedDate={selectedDate}
        selectedYear={selectedYear}
        yearStats={yearStats}
        searchQuery={searchQuery}
        onYearChange={onYearChange}
        onSearchChange={onSearchChange}
        onSelectDay={onSelectDay}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <div className={styles.dayColumn}>
        <DayView
          day={day}
          filteredEntries={filteredEntries}
          rawPointCount={rawPointCount}
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          onSelectVisit={onSelectVisit}
          onHoverEntry={onHoverEntry}
          onUnhoverEntry={onUnhoverEntry}
          onToggleTrack={onToggleTrack}
          selectedVisitId={selectedVisitId}
          expandedTrackId={expandedTrackId}
          replayState={replayState}
          onReplayChange={onReplayChange}
        />
      </div>
    </div>
  );
}
