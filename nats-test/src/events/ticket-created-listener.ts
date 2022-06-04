import { Message } from "node-nats-streaming";
import Listener from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    quoteGroupName = 'payments-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event Data', data, msg.getSequence());
        msg.ack();
    }
}

export default TicketCreatedListener;