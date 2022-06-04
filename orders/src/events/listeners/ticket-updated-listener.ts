import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from '@diegodmicroserv/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './quote-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    quoteGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;
        const ticket = await Ticket.findByEvent({
            id,
            version
        });
        if (!ticket) {
            throw new NotFoundError();
        }
        ticket.set({ title,price });
        await ticket.save();
        msg.ack();
    }
}