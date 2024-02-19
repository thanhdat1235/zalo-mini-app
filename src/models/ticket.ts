export enum TicketStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface Ticket {
  id: number;
  name: string;
  createDate: string | Date;
  modifyDate: string | Date;
  endDate: string | Date;
  status: TicketStatus;
}
