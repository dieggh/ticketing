import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@diegodmicroserv/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "../queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    quoteGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
            userId: data.userId,
        });
        await order.save();
        msg.ack();
    }
}