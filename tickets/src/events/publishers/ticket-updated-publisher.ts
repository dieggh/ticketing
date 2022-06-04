import { Publisher, Subjects, TicketUpdatedEvent } from '@diegodmicroserv/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;   
}
