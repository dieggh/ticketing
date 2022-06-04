import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@diegodmicroserv/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('returns a 404 when purchasing an order that does not exists', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdad',
            orderId: mongoose.Types.ObjectId().toHexString()
        }).expect(404)
});

it('returns 401 when purchasing  an order that does not belong to a user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId:  mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 20
    });
    await order.save();
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'asdad',
        orderId: order.id
    }).expect(401)
});

it('returns 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId:  userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 20
    });
    await order.save();
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'asdad',
        orderId: order.id
    }).expect(400)
});

it.only('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId:  userId,
        status: OrderStatus.Created,
        version: 0,
        price
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        }).expect(201);
    
    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('mxn');
    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge?.id
    });
    expect(payment).not.toBeNull();
});