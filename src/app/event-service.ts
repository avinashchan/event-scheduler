import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { EventDataModel, EventDetailModel } from './models/event-models';
import { v4 as uuidv4 } from 'uuid';
import { fromServiceModel, toServiceModel } from './models/event-utils';

/** Mocked backend store for event CRUD operations. */
const mockEvents: EventDataModel[] = [];

/**
 * REST based services for managing event data interactions.
 */
@Injectable({
  providedIn: 'root',
})
export class EventService {
  getEventsByDate(date: Date): Observable<EventDetailModel[]> {
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
  getEvents(startDate: Date, endDate: Date): Observable<EventDetailModel[]> {
    return of(mockEvents).pipe(
      // map server models -> app model
      map((events) => events.map((event) => fromServiceModel(event))),
      // filter events by date
      map((events) => {
        return events.filter(({ date }) => date >= startDate && date < endDate);
      })
    );
  }

  /** Creates a default (empty) event. */
  createEvent(): EventDetailModel {
    const eventId = uuidv4();
    // create a new date starting at the next hour
    const eventDate = new Date();
    eventDate.setHours(eventDate.getHours() + 1, 0, 0, 0);
    const startTime = new Date(eventDate);
    const endTime = new Date(eventDate);
    endTime.setHours(eventDate.getHours() + 1);

    return {
      id: eventId,
      date: eventDate,
      startTime: startTime,
      endTime: endTime,
      title: '',
      description: '',
    };
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
  deleteEvent(id: string) {
    const foundIndex = mockEvents.findIndex((event) => event.id === id);
    if (foundIndex > -1) {
      mockEvents.splice(foundIndex, 1);
      return true;
    } else {
      return false;
    }
  }
}
