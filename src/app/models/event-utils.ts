import { EventDetailModel, EventDataModel } from './event-models';

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
