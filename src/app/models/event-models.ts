/** Represents the JSON model service.  */
export interface EventDataModel {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

/** Represents the application model for an "event detail". */
export interface EventDetailModel {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  title: string;
  description: string;
}
