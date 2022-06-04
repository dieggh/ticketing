import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123qwda'
    });
    await ticket.save();
    const firstIntance = await Ticket.findById(ticket.id);
    const secondIntance = await Ticket.findById(ticket.id);

    firstIntance!.set({ price: 10 });
    secondIntance!.set({ price: 15 });

    await firstIntance!.save();
    try {
        await secondIntance!.save();
    } catch (error) {
        return Promise.resolve();
    }
    throw new Error('Should not reatch this point');
});

it('increments the version number on multiple saves', async() => {
    const ticket = Ticket.build({
        title: 'Muse',
        price: 200,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});