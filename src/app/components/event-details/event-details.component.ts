import { Component, DestroyRef, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { EventDetailModel } from '../../models/event-models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../button/button.component';
import { Store } from '@ngxs/store';
import { DeleteEvent, UpdateEvent } from '../../state/app.actions';
import { firstValueFrom, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface EventDetailForm {
  id: FormControl<string>;
  date: FormControl<Date>;
  startTime: FormControl<Date>;
  endTime: FormControl<Date>;
  title: FormControl<string>;
  description: FormControl<string>;
}

export interface EventDialogData {
  event: EventDetailModel;
}

@Component({
  selector: 'app-event-details',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatInputModule,
    ButtonComponent,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class EventDetailsComponent {
  form: FormGroup<EventDetailForm>;

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<EventDetailsComponent>,
    private destroyRef: DestroyRef,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: EventDialogData
  ) {
    // init form w/ event details
    const { id, date, startTime, endTime, title, description } =
      this.data.event;

    this.form = this.fb.group<EventDetailForm>({
      id: this.fb.nonNullable.control(id),
      date: this.fb.nonNullable.control(date),
      startTime: this.fb.nonNullable.control(startTime),
      endTime: this.fb.nonNullable.control(endTime),
      title: this.fb.nonNullable.control(title),
      description: this.fb.nonNullable.control(description),
    });

    // ensure end time always after start time
    this.form.controls.startTime.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((startTime) => {
        const endTimeControl = this.form.controls.endTime;
        if (endTimeControl.value <= startTime) {
          const endTime = new Date(startTime);
          endTime.setHours(endTime.getHours() + 1);
          endTimeControl.setValue(endTime);
        }
      });
  }

  handleSaveClick() {
    this.save().then(() => this.close());
  }

  handleDeleteClick() {
    this.delete().then((deleted) => {
      if (deleted) {
        this.close();
      }
    });
  }

  handleCancelClick() {
    this.close();
  }

  async save() {
    const { id, date, startTime, endTime, title, description } =
      this.form.getRawValue();

    const updatedEvent: EventDetailModel = {
      id,
      date,
      startTime,
      endTime,
      title,
      description,
    };

    // update/insert event
    return firstValueFrom(this.store.dispatch(new UpdateEvent(updatedEvent)));
  }

  async delete(): Promise<boolean> {
    const doDelete = confirm(
      'Are you sure you would like to delete this event?'
    );
    if (doDelete) {
      return firstValueFrom(
        this.store.dispatch(new DeleteEvent(this.data.event.id))
      ).then(() => true);
    }
    return false;
  }

  close() {
    this.dialogRef.close();
  }
}
