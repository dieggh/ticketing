import { OrderCancelledEvent, OrderStatus } from "@diegodmicroserv/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from 'mongoose';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'L arc en ciel',
        price: 200,
        userId: 'abc'
    });
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { data, listener, msg, ticket, orderId }
};

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg, orderId } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});