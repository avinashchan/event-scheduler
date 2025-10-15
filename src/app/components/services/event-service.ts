import { Injectable } from '@angular/core';
import { EventDataModel, EventDetailModel } from '../../models/event-models';
import {
  createEvent,
  fromServiceModel,
  toServiceModel,
} from '../../utils/event-utils';

function mockDate(offsetHours: number): EventDataModel {
  const now = new Date();
  const nextHour = Math.max(0, now.getHours() + offsetHours);
  now.setHours(nextHour);
  return {
    ...toServiceModel(createEvent(now)),
    title: `Event ${offsetHours} hours`,
  };
}

/** Mocked backend store for event CRUD operations. */
const mockEvents: EventDataModel[] = [
  // default events
  mockDate(-2),
  mockDate(2),
];

/**
 * REST based services for managing event data interactions.
 */
@Injectable({
  providedIn: 'root',
})
export class EventService {
  async getEventsByDate(date: Date): Promise<EventDetailModel[]> {
    // normalize stat date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    // set end date (+1 day)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    return this.getEvents(startDate, endDate);
  }

  /**
   * Gets a list of events within the date range.
   * @param startDate
   * @param endDate
   * @returns
   */
  async getEvents(startDate: Date, endDate: Date): Promise<EventDetailModel[]> {
    return (
      mockEvents
        // map server models -> app model
        .map((event) => fromServiceModel(event))
        // filter events by date
        .filter(({ date }) => {
          return date >= startDate && date < endDate;
        })
    );
  }

  /** Adds the event. */
  async addEvent(event: EventDetailModel) {
    mockEvents.push(toServiceModel(event));
    return true;
  }

  /** Updates the event. */
  async updateEvent(event: EventDetailModel): Promise<boolean> {
    const foundEventData = mockEvents.find(
      (mockEvent) => event.id === mockEvent.id
    );
    if (foundEventData) {
      const eventData = toServiceModel(event);
      Object.assign(foundEventData, eventData);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Deletes the event via unique id.
   * @param id The id of the event to delete.
   * @returns Returns if the event was found and deleted.
   */
  async deleteEvent(id: string) {
    const foundIndex = mockEvents.findIndex((event) => event.id === id);
    if (foundIndex > -1) {
      mockEvents.splice(foundIndex, 1);
      return true;
    } else {
      return false;
    }
  }
}
