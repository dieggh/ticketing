import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedEvent, OrderStatus } from '@diegodmicroserv/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'asdasd',
        userId: 'asdasda',
        status: OrderStatus.Created,
        ticket: {
            id: 'asdad',
            price: 10
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { msg, listener, data}
}

it('replicates order info', async () => {
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.price).toBe(data.ticket.price)
});

it('acks the message', async () => {
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})