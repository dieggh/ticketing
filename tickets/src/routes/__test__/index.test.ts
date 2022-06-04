import request from "supertest";
import { app } from "../../app";

const createTicket = () =>{
    const title = 'concert';
    const price = 20;
    return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title, 
        price
    }).expect(201);
}

it('if can fetch a list of tickets', async () => {
    
    await createTicket();
    await createTicket();
    await createTicket();


    const response = await request(app)
        .get(`/api/tickets`)
        .send()
        .expect(200);
    
        expect(response.body.length).toEqual(3);
    
})


it('returns the ticket if it is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title, 
            price
        }).expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);
    
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})  