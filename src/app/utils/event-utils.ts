import { EventDetailModel, EventDataModel } from '../models/event-models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts the service model into an application model.
 * @param appModel
 * @returns
 */
export function toServiceModel(appModel: EventDetailModel): EventDataModel {
  const { id, date, startTime, endTime, title, description } = appModel;

  return {
    id,
    date: date.toISOString(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    title,
    description,
  };
}

/**
 * Converts the application model into a service model.
 * @param serviceModel
 * @returns
 */
export function fromServiceModel(
  serviceModel: EventDataModel
): EventDetailModel {
  const { id, date, startTime, endTime, title, description } = serviceModel;

  return {
    id,
    date: new Date(date),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    title,
    description,
  };
}

/**
 * Creates a default event based on the source date/time.
 * @param sourceDate
 * @returns
 */
export function createEvent(sourceDate: Date): EventDetailModel {
  // generate a unique id
  const id = uuidv4();
  // create a new date starting at the next hour
  const date = new Date(sourceDate);
  date.setHours(date.getHours() + 1, 0, 0, 0);
  const startTime = new Date(date);
  const endTime = new Date(date);
  endTime.setHours(date.getHours() + 1);

  return {
    id,
    date,
    startTime,
    endTime,
    title: '',
    description: '',
  };
}
