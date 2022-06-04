import { OrderCancelledEvent, OrderStatus } from "@diegodmicroserv/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from 'mongoose';
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'asdad',
        version: 0
    });
    await order.save()
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 0,
        ticket: {
            id: 'asdad',
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { msg, listener, data, order }
}

it('updates the status of the order', async () => {
    const { listener, data, order, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
    const { listener, data, order, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
})