import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@diegodmicroserv/common";
import { quoueGroupName } from "./quoue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    quoteGroupName: string = quoueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
       const ticket = await Ticket.findById(data.ticket.id);
       if (!ticket) {
           throw new Error('ticket not found');
       }
       ticket.set({ orderId: data.id });
       await ticket.save();
       await new TicketUpdatedPublisher(this.client)
        .publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });
       msg.ack();
    }
}