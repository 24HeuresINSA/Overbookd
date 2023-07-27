export interface FaTimeWindow {
  id: number;
  start: Date;
  end: Date;
}

export interface FaTimeWindowWithOptionalId {
  id?: number;
  start: Date;
  end: Date;
}

export class FaTimeWindowRepresentation implements FaTimeWindow {
  id: number;
  start: Date;
  end: Date;
}

export class FaTimeWindowWithOptionalIdRepresentation
  implements FaTimeWindowWithOptionalId
{
  id?: number;
  start: Date;
  end: Date;
}
