import { EventDetailModel } from '../models/event-models';

export class SetDate {
  static readonly type = '[App] Set Active Date';
  constructor(readonly date: Date) {}
}

export class GetEvents {
  static readonly type = '[App] Get Active Events';
  constructor() {}
}

export class SetEvents {
  static readonly type = '[App] Set Active Events';
  constructor(readonly events: EventDetailModel[]) {}
}

export class UpdateEvent {
  static readonly type = '[App] Update Event';
  constructor(readonly event: EventDetailModel) {}
}

export class DeleteEvent {
  static readonly type = '[App] Delete Event';
  constructor(readonly eventId: string) {}
}
