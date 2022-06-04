import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// an interface that describe the properties 
//that are required to create a new Ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}
//interface that describes propierties that a Ticket document has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

//an interface that describe the propierties that the Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const TicketSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    orderId: {
        type: String
    }
},{
    toJSON: {
      transform(doc, ret){
          ret.id = ret._id;
          delete ret._id;          
          delete ret.__v;
      }  
    }
});

TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.statics.build = ( attrs: TicketAttrs ) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketSchema);


export { Ticket };