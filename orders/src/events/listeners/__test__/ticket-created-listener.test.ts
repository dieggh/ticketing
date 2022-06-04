import { TicketCreatedEvent } from "@diegodmicroserv/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = () => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Muse',
        price: 30,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, data, msg };
}

it('creates and save a ticket', async () => {
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toBe(data.title);
});

it('acks an event', async () => {
    const { listener, data, msg } = setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalledTimes(1);
});



