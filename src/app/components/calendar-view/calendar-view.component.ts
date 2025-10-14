import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { EventDetailModel } from '../../models/event-models';

/** A range of alternating calendar event colors. */
const eventColors: string[] = [
  // oranges
  `bg-orange-500`,
  `bg-orange-600`,
  `bg-orange-700`,
  `bg-orange-800`,
  `bg-orange-900`,
  // reds
  `bg-red-500`,
  `bg-red-600`,
  `bg-red-700`,
  `bg-red-800`,
  `bg-red-900`,
];

@Component({
  selector: 'app-calendar-view',
  imports: [DatePipe],
  providers: [DatePipe],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})
export class CalendarViewComponent {
  /** The date of events to display. */
  date = input.required<Date>();

  events = input<EventDetailModel[]>([]);

  eventSelected = output<EventDetailModel>();

  hours = computed<Date[]>(() => {
    // zero out current date + generate the 24 hour increment
    const hours: Date[] = [];
    const baseDate = new Date(this.date());
    for (let incrementHour = 0; incrementHour < 24; incrementHour++) {
      const timestamp = baseDate.setHours(incrementHour);
      hours.push(new Date(timestamp));
    }
    return hours;
  });

  constructor(private datePipe: DatePipe) {}

  handleEditEvent(event: EventDetailModel) {
    this.eventSelected.emit(event);
  }

  formatEventLabel(event: EventDetailModel): string {
    const { title, description } = event;
    const titles: string[] = [title || '[Event]'];
    if (description) {
      titles.push(description);
    }
    return titles.join(': ');
  }

  formatEventTime(event: EventDetailModel): string {
    const { startTime, endTime } = event;
    const startTimeLabel = this.datePipe.transform(startTime, 'h:mm a');
    const endTimeLabel = this.datePipe.transform(endTime, 'h:mm a');

    return `${startTimeLabel} - ${endTimeLabel}`;
  }

  getEventHeightPercent(event: EventDetailModel): number {
    const { startTime, endTime } = event;
    return this.getDayPercentageHours(startTime, endTime);
  }

  getEventTopPercent(event: EventDetailModel): number {
    const { startTime } = event;
    // get initial date (i.e., mid-night)
    const baseTime = new Date(startTime);
    baseTime.setHours(0, 0, 0, 0);
    // calculate the percent of lapsed time from mid-night -> event start time
    return this.getDayPercentageHours(baseTime, startTime);
  }

  getDayPercentageHours(startTime: Date, endTime: Date): number {
    const diffMS = endTime.getTime() - startTime.getTime();
    const diffMinutes = diffMS / (1000 * 60);
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;
    const percent = diffDays * 100;
    return Math.max(0, percent);
  }

  getCSSClasses(
    events: EventDetailModel[],
    event: EventDetailModel,
    index: number
  ): string[] {
    const targetIndex = index % events.length;
    const color = eventColors[targetIndex];
    const bgClass = `${color}`;
    return [bgClass];
  }
}
