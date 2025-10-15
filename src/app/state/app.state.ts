import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EventDetailModel } from '../models/event-models';
import {
  DeleteEvent,
  GetEvents,
  SetDate,
  SetEvents,
  UpdateEvent,
} from './app.actions';
import { EventService } from '../components/services/event-service';

export interface AppStateModel {
  activeDate: Date;
  activeEvents: EventDetailModel[];
}

@State<AppStateModel>({
  name: 'user',
  defaults: {
    activeDate: new Date(),
    activeEvents: [],
  },
})
@Injectable()
export class AppState {
  @Selector()
  static getActiveDate(state: AppStateModel): Date {
    return state.activeDate;
  }

  @Selector()
  static getActiveEvents(state: AppStateModel): EventDetailModel[] {
    return state.activeEvents;
  }

  @Action(SetDate)
  setDate(ctx: StateContext<AppStateModel>, { date }: SetDate) {
    ctx.patchState({
      activeDate: date,
      activeEvents: [],
    });

    ctx.dispatch(new GetEvents());
  }

  @Action(GetEvents)
  getEvents(ctx: StateContext<AppStateModel>) {
    const { activeDate } = ctx.getState();
    this.eventService.getEventsByDate(activeDate).then((events) => {
      ctx.patchState({
        activeEvents: events,
      });
    });
  }

  @Action(SetEvents)
  setEvents(ctx: StateContext<AppStateModel>, { events }: SetEvents) {
    ctx.patchState({
      activeEvents: events,
    });
  }

  @Action(UpdateEvent)
  async updateEvent(ctx: StateContext<AppStateModel>, { event }: UpdateEvent) {
    return this.eventService
      .updateEvent(event)
      .then((updated) => {
        return updated ? updated : this.eventService.addEvent(event);
      })
      .then(() => {
        ctx.dispatch(new GetEvents());
      });
  }

  @Action(DeleteEvent)
  async deleteEvent(
    ctx: StateContext<AppStateModel>,
    { eventId }: DeleteEvent
  ) {
    return this.eventService.deleteEvent(eventId).then(() => {
      ctx.dispatch(new GetEvents());
    });
  }

  constructor(private eventService: EventService) {}
}
