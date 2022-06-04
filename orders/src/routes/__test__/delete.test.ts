import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        title: 'Muse',
        price: 84,
        id: mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();
    const user = global.signin();
    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    const ticket = Ticket.build({
        title: 'Muse',
        price: 84,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    const user = global.signin();
    const { body: order } = await request(app)
        .post(`/api/orders`)
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(204);
    
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});