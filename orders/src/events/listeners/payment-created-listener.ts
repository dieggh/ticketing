import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@diegodmicroserv/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./quote-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    quoteGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new NotFoundError();
        }
        order.set({ status: OrderStatus.Complete });
        await order.save();
        msg.ack();
    }
}