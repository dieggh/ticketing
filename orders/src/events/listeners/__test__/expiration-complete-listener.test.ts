import { ExpirationCompleteEvent } from "@diegodmicroserv/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 300,
    });
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdasd',
        expiresAt: new Date(),
        ticket: ticket,
    });
    await order.save();
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order!.id,
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, data, msg, order, ticket };
}

it('updates the order status to cancelled', async () => {
    const { order, listener, msg, data } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    const { order, listener, msg, data } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]); 
    expect(eventData.id).toEqual(order.id);
})

it('aks the event', async () => {
    const { listener, msg, data } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});