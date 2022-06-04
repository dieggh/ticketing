import { Publisher, Subjects, TicketCreatedEvent } from '@diegodmicroserv/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;   
}
