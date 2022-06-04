import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

type Ticket = {
    id?: string;
    title: string;
    price: number;
};

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number}): Promise<TicketDoc | null>; 
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

TicketSchema.statics.build = (attrs: TicketAttrs) => {
    const ticket = { ...attrs, _id: attrs.id } as Ticket;
    delete ticket.id;
    return new Ticket(ticket);
}

TicketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    return Boolean(existingOrder);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);

export {
    Ticket
}