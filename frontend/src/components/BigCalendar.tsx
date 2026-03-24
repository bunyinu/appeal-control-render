import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Views,
  momentLocalizer,
  SlotInfo,
  EventProps,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Link from 'next/link';

import ListActionsPopover from './ListActionsPopover';
import { useAppSelector } from '../stores/hooks';
import { hasPermission } from '../helpers/userPermissions';
import { humanize } from '../helpers/humanize';

const localizer = momentLocalizer(moment);
const defaultEventDurationMinutes = 30;

type TEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  due_at?: string | null;
  completed_at?: string | null;
  case?: {
    case_number?: string | null;
  } | null;
  assignee_user?: {
    firstName?: string | null;
  } | null;
};

type CalendarRange = {
  start: Date;
  end: Date;
} | null;

type Props = {
  events: any[];
  handleDeleteAction: (id: string) => void;
  handleCreateEventAction: (slotInfo: SlotInfo) => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  entityName: string;
  showField: string;
  pathEdit?: string;
  pathView?: string;
  'start-data-key': string;
  'end-data-key': string;
};

function humanizeSingular(value: string) {
  const label = humanize(value || '').trim();

  if (label.endsWith('s')) {
    return label.slice(0, -1);
  }

  return label;
}

function formatDateTime(value?: Date | string | null) {
  if (!value) {
    return 'Not scheduled';
  }

  return moment(value).format('ddd, MMM D • h:mm A');
}

function formatRangeLabel(
  range: CalendarRange,
  view: string,
  currentDate: Date,
) {
  if (!range) {
    if (view === Views.MONTH) {
      return moment(currentDate).format('MMMM YYYY');
    }

    return moment(currentDate).format('ddd, MMM D');
  }

  if (view === Views.MONTH) {
    return moment(range.start).format('MMMM YYYY');
  }

  if (view === Views.DAY) {
    return moment(range.start).format('dddd, MMMM D');
  }

  if (moment(range.start).isSame(range.end, 'day')) {
    return moment(range.start).format('ddd, MMM D');
  }

  return `${moment(range.start).format('MMM D')} - ${moment(range.end).format('MMM D')}`;
}

const BigCalendar = ({
  events,
  handleDeleteAction,
  handleCreateEventAction,
  onDateRangeChange,
  entityName,
  showField,
  pathEdit,
  pathView,
  'start-data-key': startDataKey,
  'end-data-key': endDataKey,
}: Props) => {
  const [myEvents, setMyEvents] = useState<TEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<string>(Views.WORK_WEEK);
  const [visibleRange, setVisibleRange] = useState<CalendarRange>(null);
  const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const prevRange = useRef<{ start: string; end: string } | null>(null);

  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission =
    currentUser &&
    hasPermission(currentUser, `UPDATE_${entityName.toUpperCase()}`);
  const hasCreatePermission =
    currentUser &&
    hasPermission(currentUser, `CREATE_${entityName.toUpperCase()}`);

  const entityLabelSingular = humanizeSingular(entityName);
  const scrollToTime = useMemo(() => new Date(1970, 1, 1, 6), []);
  const minTime = useMemo(() => new Date(1970, 1, 1, 6), []);
  const maxTime = useMemo(() => new Date(1970, 1, 1, 20), []);

  useEffect(() => {
    if (!events || !Array.isArray(events) || !events.length) {
      setMyEvents([]);
      return;
    }

    const formattedEvents = events
      .filter((event) => event?.[startDataKey])
      .map((event) => {
        const start = new Date(event[startDataKey]);

        if (Number.isNaN(start.getTime())) {
          return null;
        }

        const rawEnd = event?.[endDataKey] ? new Date(event[endDataKey]) : null;
        const hasValidEnd =
          rawEnd &&
          !Number.isNaN(rawEnd.getTime()) &&
          rawEnd.getTime() >= start.getTime();

        return {
          ...event,
          start,
          end: hasValidEnd
            ? rawEnd
            : moment(start).add(defaultEventDurationMinutes, 'minutes').toDate(),
          title: event[showField] || `Untitled ${entityLabelSingular.toLowerCase()}`,
        };
      })
      .filter(Boolean)
      .sort(
        (firstEvent, secondEvent) =>
          firstEvent.start.getTime() - secondEvent.start.getTime(),
      );

    setMyEvents(formattedEvents);
  }, [endDataKey, entityLabelSingular, events, showField, startDataKey]);

  useEffect(() => {
    if (!myEvents.length) {
      setSelectedEvent(null);
      return;
    }

    setSelectedEvent((currentValue) => {
      if (currentValue) {
        const refreshedEvent = myEvents.find((event) => event.id === currentValue.id);

        if (refreshedEvent) {
          return refreshedEvent;
        }
      }

      return (
        myEvents.find((event) => moment(event.end).isSameOrAfter(moment(), 'minute')) ||
        myEvents[0]
      );
    });
  }, [myEvents]);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const calendarStats = useMemo(() => {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');

    return [
      {
        key: 'scheduled',
        label: 'Scheduled',
        value: myEvents.length,
        tone: 'calendar-shell__legend-dot--scheduled',
      },
      {
        key: 'today',
        label: 'Due Today',
        value: myEvents.filter((event) =>
          moment(event.start).isBetween(todayStart, todayEnd, undefined, '[]'),
        ).length,
        tone: 'calendar-shell__legend-dot--today',
      },
      {
        key: 'overdue',
        label: 'Overdue',
        value: myEvents.filter(
          (event) =>
            moment(event.start).isBefore(moment()) && event.status !== 'done',
        ).length,
        tone: 'calendar-shell__legend-dot--overdue',
      },
      {
        key: 'blocked',
        label: 'Blocked',
        value: myEvents.filter((event) => event.status === 'blocked').length,
        tone: 'calendar-shell__legend-dot--blocked',
      },
    ];
  }, [myEvents]);

  const rangeLabel = useMemo(
    () => formatRangeLabel(visibleRange, currentView, currentDate),
    [currentDate, currentView, visibleRange],
  );

  const visibleEvents = useMemo(() => {
    const sortedEvents = [...myEvents].sort(
      (firstEvent, secondEvent) =>
        firstEvent.start.getTime() - secondEvent.start.getTime(),
    );

    if (!visibleRange) {
      return sortedEvents;
    }

    return sortedEvents.filter(
      (event) =>
        event.start.getTime() <= visibleRange.end.getTime() &&
        event.end.getTime() >= visibleRange.start.getTime(),
    );
  }, [myEvents, visibleRange]);

  const agendaEvents = useMemo(() => {
    const activeEvents = visibleEvents.length
      ? visibleEvents
      : myEvents.filter((event) => moment(event.end).isSameOrAfter(moment(), 'day'));

    return activeEvents.slice(0, isExpanded ? 10 : 6);
  }, [isExpanded, myEvents, visibleEvents]);

  const focusEvent = (event: TEvent) => {
    setSelectedEvent(event);
    setCurrentDate(event.start);

    if (currentView === Views.MONTH) {
      setCurrentView(Views.WEEK);
    }
  };

  const getEventClassName = (event: TEvent) => {
    if (event.status === 'done') {
      return 'calendar-event calendar-event--done';
    }
    if (event.status === 'blocked') {
      return 'calendar-event calendar-event--blocked';
    }
    if (event.priority === 'urgent') {
      return 'calendar-event calendar-event--urgent';
    }
    if (event.priority === 'high') {
      return 'calendar-event calendar-event--high';
    }

    return 'calendar-event calendar-event--default';
  };

  const onRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    const nextVisibleRange = Array.isArray(range)
      ? {
          start: range[0],
          end: range[range.length - 1],
        }
      : {
          start: range.start,
          end: range.end,
        };

    if (!nextVisibleRange.start || !nextVisibleRange.end) {
      return;
    }

    setVisibleRange(nextVisibleRange);

    const nextRange = {
      start: moment(nextVisibleRange.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(nextVisibleRange.end).format('YYYY-MM-DDTHH:mm'),
    };

    if (nextRange.start === nextRange.end) {
      nextRange.end = moment(nextRange.end).add(1, 'days').format('YYYY-MM-DDTHH:mm');
    }

    if (
      prevRange.current &&
      prevRange.current.start <= nextRange.start &&
      prevRange.current.end >= nextRange.end
    ) {
      return;
    }

    prevRange.current = nextRange;
    onDateRangeChange(nextRange);
  };

  const selectedViewHref = selectedEvent && pathView ? `${pathView}${selectedEvent.id}` : '#';
  const selectedEditHref = selectedEvent && pathEdit ? `${pathEdit}${selectedEvent.id}` : selectedViewHref;
  const selectedMetadata = selectedEvent
    ? [
        selectedEvent.priority ? humanize(selectedEvent.priority) : '',
        selectedEvent.status ? humanize(selectedEvent.status) : '',
      ].filter(Boolean)
    : [];

  return (
    <div className={`calendar-shell ${isExpanded ? 'calendar-shell--expanded' : ''}`}>
      {isExpanded && (
        <button
          aria-label='Close expanded calendar'
          className='calendar-shell__scrim'
          onClick={() => setIsExpanded(false)}
          type='button'
        />
      )}
      <div className='calendar-shell__surface'>
        <div className='calendar-shell__header'>
          <div className='calendar-shell__header-copy'>
            <div className='calendar-shell__eyebrow'>Task calendar</div>
            <div className='calendar-shell__title'>Plan work like a real scheduling desk</div>
            <div className='calendar-shell__description'>
              Review due windows, inspect a selected task without leaving the grid, and
              expand into a larger planning view when the queue gets crowded.
            </div>
          </div>
          <div className='calendar-shell__header-actions'>
            <div className='calendar-shell__range-card'>
              <div className='calendar-shell__range-label'>Visible Range</div>
              <div className='calendar-shell__range-value'>{rangeLabel}</div>
            </div>
            <button
              className='calendar-shell__expand-button'
              onClick={() => setIsExpanded((currentValue) => !currentValue)}
              type='button'
            >
              {isExpanded ? 'Collapse Calendar' : 'Expand Calendar'}
            </button>
          </div>
        </div>

        <div className='calendar-shell__legend'>
          {calendarStats.map((item) => (
            <div className='calendar-shell__legend-chip' key={item.key}>
              <span className={`calendar-shell__legend-dot ${item.tone}`} />
              <span>{item.label}</span>
              <span className='calendar-shell__legend-value'>{item.value}</span>
            </div>
          ))}
        </div>

        <div className='calendar-workspace'>
          <div className='calendar-workspace__main'>
            <div className='calendar-shell__body'>
              <Calendar
                date={currentDate}
                view={currentView as any}
                views={[Views.MONTH, Views.WEEK, Views.WORK_WEEK, Views.DAY, Views.AGENDA]}
                events={myEvents}
                localizer={localizer}
                selectable={hasCreatePermission}
                popup
                popupOffset={12}
                showMultiDayTimes
                dayLayoutAlgorithm='no-overlap'
                min={minTime}
                max={maxTime}
                step={30}
                timeslots={2}
                onNavigate={(nextDate) => setCurrentDate(nextDate)}
                onView={(nextView) => setCurrentView(nextView)}
                onSelectEvent={(event) => focusEvent(event as TEvent)}
                onSelectSlot={handleCreateEventAction}
                onRangeChange={onRangeChange}
                scrollToTime={scrollToTime}
                messages={{
                  showMore: (total) => `+${total} more tasks`,
                  noEventsInRange: 'No tasks scheduled in this range.',
                }}
                formats={{
                  weekdayFormat: (date) => moment(date).format('ddd'),
                  dayHeaderFormat: (date) => moment(date).format('ddd, MMM D'),
                  dayRangeHeaderFormat: ({ start, end }) =>
                    `${moment(start).format('MMM D')} - ${moment(end).format('MMM D')}`,
                }}
                dayPropGetter={(date) => ({
                  className:
                    date.getDay() === 0 || date.getDay() === 6
                      ? 'calendar-day--weekend'
                      : '',
                })}
                eventPropGetter={(event) => ({
                  className: [
                    getEventClassName(event as TEvent),
                    selectedEvent?.id === event.id ? 'calendar-event--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' '),
                })}
                components={{
                  toolbar: (toolbarProps) => <CalendarToolbar {...toolbarProps} />,
                  event: (props) => (
                    <MyCustomEvent
                      {...props}
                      onDelete={handleDeleteAction}
                      hasUpdatePermission={hasUpdatePermission}
                      pathEdit={pathEdit}
                      pathView={pathView}
                    />
                  ),
                }}
              />
              {!myEvents.length && (
                <div className='calendar-empty'>
                  No tasks are scheduled in the current range.
                </div>
              )}
            </div>
          </div>

          <aside className='calendar-workspace__sidebar'>
            <div className='calendar-panel'>
              <div className='calendar-panel__eyebrow'>Selected Task</div>
              {selectedEvent ? (
                <>
                  <div className='calendar-panel__title'>{selectedEvent.title}</div>
                  {selectedMetadata.length > 0 && (
                    <div className='calendar-event__meta'>
                      {selectedMetadata.map((item) => (
                        <span className='calendar-event__badge' key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className='calendar-panel__description'>
                    {selectedEvent.description || 'No additional task notes are attached yet.'}
                  </div>
                  <div className='calendar-panel__meta-grid'>
                    <div className='calendar-panel__meta-card'>
                      <div className='calendar-panel__meta-label'>Due</div>
                      <div className='calendar-panel__meta-value'>
                        {formatDateTime(selectedEvent.start)}
                      </div>
                    </div>
                    <div className='calendar-panel__meta-card'>
                      <div className='calendar-panel__meta-label'>Window</div>
                      <div className='calendar-panel__meta-value'>
                        {selectedEvent.completed_at
                          ? formatDateTime(selectedEvent.end)
                          : 'Open-ended'}
                      </div>
                    </div>
                    <div className='calendar-panel__meta-card'>
                      <div className='calendar-panel__meta-label'>Case</div>
                      <div className='calendar-panel__meta-value'>
                        {selectedEvent.case?.case_number || 'Not linked'}
                      </div>
                    </div>
                    <div className='calendar-panel__meta-card'>
                      <div className='calendar-panel__meta-label'>Assignee</div>
                      <div className='calendar-panel__meta-value'>
                        {selectedEvent.assignee_user?.firstName || 'Unassigned'}
                      </div>
                    </div>
                  </div>
                  <div className='calendar-panel__actions'>
                    <Link className='calendar-panel__action calendar-panel__action--primary' href={selectedViewHref}>
                      Open Task
                    </Link>
                    {hasUpdatePermission && (
                      <Link className='calendar-panel__action' href={selectedEditHref}>
                        Edit Task
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <div className='calendar-panel__empty'>
                  Select a task to inspect its schedule, context, and actions.
                </div>
              )}
            </div>

            <div className='calendar-panel'>
              <div className='calendar-panel__heading-row'>
                <div>
                  <div className='calendar-panel__eyebrow'>Visible Schedule</div>
                  <div className='calendar-panel__subheading'>{rangeLabel}</div>
                </div>
                <div className='calendar-panel__count'>{visibleEvents.length}</div>
              </div>
              {agendaEvents.length ? (
                <div className='calendar-agenda'>
                  {agendaEvents.map((event) => {
                    const agendaMeta = [
                      formatDateTime(event.start),
                      event.case?.case_number ? `Case ${event.case.case_number}` : '',
                      event.assignee_user?.firstName || '',
                    ]
                      .filter(Boolean)
                      .join(' · ');

                    return (
                      <button
                        className='calendar-agenda__item'
                        data-active={selectedEvent?.id === event.id}
                        key={event.id}
                        onClick={() => focusEvent(event)}
                        type='button'
                      >
                        <div className='calendar-agenda__item-row'>
                          <span className='calendar-agenda__item-title'>{event.title}</span>
                          <span className='calendar-agenda__item-time'>
                            {moment(event.start).format('h:mm A')}
                          </span>
                        </div>
                        <div className='calendar-agenda__item-meta'>{agendaMeta}</div>
                      </button>
                    );
                  })}
                  {visibleEvents.length > agendaEvents.length && (
                    <div className='calendar-agenda__more'>
                      {visibleEvents.length - agendaEvents.length} more tasks in this range. Use
                      agenda view to scan the full list.
                    </div>
                  )}
                </div>
              ) : (
                <div className='calendar-panel__empty'>
                  Nothing is scheduled in this window yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const CalendarToolbar = ({
  label,
  onNavigate,
  onView,
  view,
  views,
}) => {
  const availableViews = Array.isArray(views) ? views : Object.keys(views || {});

  return (
    <div className='calendar-toolbar rbc-toolbar'>
      <div className='calendar-toolbar__nav-group'>
        <button
          className='calendar-toolbar__button calendar-toolbar__button--ghost'
          type='button'
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </button>
        <button
          className='calendar-toolbar__button'
          type='button'
          onClick={() => onNavigate('PREV')}
        >
          Back
        </button>
        <button
          className='calendar-toolbar__button'
          type='button'
          onClick={() => onNavigate('NEXT')}
        >
          Next
        </button>
      </div>
      <div className='calendar-toolbar__label'>{label}</div>
      <div className='calendar-toolbar__view-group'>
        {availableViews.map((viewName) => (
          <button
            className='calendar-toolbar__button'
            data-active={view === viewName}
            key={viewName}
            type='button'
            onClick={() => onView(viewName)}
          >
            {humanize(viewName)}
          </button>
        ))}
      </div>
    </div>
  );
};

const MyCustomEvent = (
  props: {
    onDelete: (id: string) => void;
    hasUpdatePermission: boolean;
    pathEdit?: string;
    pathView?: string;
  } & EventProps<TEvent>,
) => {
  const { onDelete, hasUpdatePermission, title, event, pathEdit, pathView } = props;
  const caseNumber = event.case?.case_number;
  const assigneeName = event.assignee_user?.firstName;
  const viewHref = pathView ? `${pathView}${event.id}` : '#';
  const editHref = pathEdit ? `${pathEdit}${event.id}` : viewHref;
  const metadata = [
    event.priority ? humanize(event.priority) : '',
    event.status ? humanize(event.status) : '',
  ].filter(Boolean);
  const context = [caseNumber ? `Case ${caseNumber}` : '', assigneeName || '']
    .filter(Boolean)
    .join(' · ');

  return (
    <div className='calendar-event__content'>
      <div className='calendar-event__body'>
        <div className='calendar-event__title-row'>
          <Link href={viewHref} className='calendar-event__title'>
            {title}
          </Link>
          <span className='calendar-event__time'>{moment(event.start).format('h:mm A')}</span>
        </div>
        {metadata.length > 0 && (
          <div className='calendar-event__meta'>
            {metadata.map((item) => (
              <span className='calendar-event__badge' key={item}>
                {item}
              </span>
            ))}
          </div>
        )}
        {context && <div className='calendar-event__context'>{context}</div>}
      </div>
      <div className='calendar-event__actions'>
        <Link href={viewHref} className='sr-only'>
          Open task
        </Link>
        <ListActionsPopover
          className='w-2 h-2 text-current'
          iconClassName='w-4'
          itemId={event.id}
          onDelete={onDelete}
          pathEdit={editHref}
          pathView={viewHref}
          hasUpdatePermission={hasUpdatePermission}
        />
      </div>
    </div>
  );
};

export default BigCalendar;
