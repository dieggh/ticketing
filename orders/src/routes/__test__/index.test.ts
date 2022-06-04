import { Ticket } from "../../models/ticket";
import request from 'supertest';
import { app } from "../../app";
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'Muse',
        price: 60,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    return ticket;
};

it('fetches orders for an particular user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketOne.id})
        .expect(201);
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticketTwo.id})
        .expect(201);
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticketThree.id})
        .expect(201);
    
    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);
    
    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketOne.id);

});