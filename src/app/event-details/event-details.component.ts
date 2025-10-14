import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { EventDetailModel } from '../models/event-models';
import { EventService } from '../event-service';
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
    private dialogRef: MatDialogRef<EventDetailsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: EventDialogData,
    private eventService: EventService
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
  }

  handleSaveClick() {
    this.save().then(() => this.close());
  }

  handleDeleteClick() {
    this.delete().then(() => this.close());
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
    return this.eventService.updateEvent(updatedEvent).then((updated) => {
      return updated ? updated : this.eventService.addEvent(updatedEvent);
    });
  }

  async delete() {
    return this.eventService.deleteEvent(this.data.event.id);
  }

  close() {
    this.dialogRef.close();
  }
}
