import { Component, DestroyRef, effect, model, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventService } from '../../event-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  EventDetailsComponent,
  EventDialogData,
} from '../../components/event-details/event-details.component';
import { EventDetailModel } from '../../models/event-models';
import { ButtonComponent } from '../../components/button/button.component';
import { CalendarViewComponent } from '../../components/calendar-view/calendar-view.component';
import { mergeMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatDialogModule,
    MatInput,
    MatDatepickerModule,
    FormsModule,
    ButtonComponent,
    CalendarViewComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  /** The active date: defaults to today */
  activeDate = model<Date>(new Date());

  /** The events for the active date. */
  activeEvents = signal<EventDetailModel[]>([]);

  constructor(
    private destroyRef: DestroyRef,
    private dialog: MatDialog,
    private eventService: EventService
  ) {
    // ensure changes to active date trigger refresh of events list
    effect(() => {
      this.refreshEvents(this.activeDate());
    });
  }

  refreshEvents(date: Date) {
    this.eventService
      .getEventsByDate(date)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((events) => {
        this.activeEvents.set(events);
      });
  }

  handlePrevDayClick() {
    this.activeDate.update((date) => this.incrementDate(date, -1));
  }

  handleNextDayClick() {
    this.activeDate.update((date) => this.incrementDate(date, +1));
  }

  handleAddClick() {
    const blankEvent = this.eventService.createEvent();
    this.editEvent(blankEvent);
  }

  handleEventSelected(event: EventDetailModel) {
    this.editEvent(event);
  }

  /** Edits the event details in a dialog. */
  private editEvent(event: EventDetailModel) {
    this.dialog
      .open(EventDetailsComponent, {
        ariaLabel: 'Event Details',
        disableClose: false,
        data: <EventDialogData>{
          event,
        },
      })
      .afterClosed()
      .pipe(
        // refresh events
        mergeMap(() => this.eventService.getEventsByDate(this.activeDate())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((events) => {
        this.activeEvents.set(events);
      });
  }

  private incrementDate(date: Date, days: number) {
    const timeStamp = date.setDate(date.getDate() + days);
    return new Date(timeStamp);
  }
}
