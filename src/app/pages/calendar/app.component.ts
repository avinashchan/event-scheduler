import { Component, DestroyRef, effect, model } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventService } from '../../components/services/event-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  EventDetailsComponent,
  EventDialogData,
} from '../../components/event-details/event-details.component';
import { EventDetailModel } from '../../models/event-models';
import { ButtonComponent } from '../../components/button/button.component';
import { CalendarViewComponent } from '../../components/calendar-view/calendar-view.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { select, Store } from '@ngxs/store';
import { AppState } from '../../state/app.state';
import { GetEvents, SetDate } from '../../state/app.actions';
import { createEvent } from '../../utils/event-utils';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatTooltipModule,
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
  activeDate = select(AppState.getActiveDate);

  /** The events for the active date. */
  activeEvents = select(AppState.getActiveEvents);

  dateSelection = model<Date>(new Date());

  constructor(
    private store: Store,
    private destroyRef: DestroyRef,
    private dialog: MatDialog,
    private eventService: EventService
  ) {
    // ensure changes to active date trigger refresh of events list
    effect(() => {
      const activeDate = this.activeDate();
      this.store.dispatch(new GetEvents());

      this.dateSelection.set(activeDate);
    });

    effect(() => {
      const dateSelection = this.dateSelection();
      this.store.dispatch(new SetDate(dateSelection));
    });
  }

  handlePrevDayClick() {
    const activeDate = this.activeDate();
    const nextDate = this.incrementDate(activeDate, -1);
    this.store.dispatch(new SetDate(nextDate));
  }

  handleNextDayClick() {
    const activeDate = this.activeDate();
    const nextDate = this.incrementDate(activeDate, +1);
    this.store.dispatch(new SetDate(nextDate));
  }

  handleAddClick() {
    const activeDate = this.activeDate();
    const blankEvent = createEvent(activeDate);
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // refresh events
        this.store.dispatch(new GetEvents());
      });
  }

  private incrementDate(date: Date, days: number) {
    const timeStamp = date.setDate(date.getDate() + days);
    return new Date(timeStamp);
  }
}
