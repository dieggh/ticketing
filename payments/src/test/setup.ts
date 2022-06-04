import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from 'jsonwebtoken';

declare global {
    function signin(id?: string): string[];
}

jest.mock('../nats-wrapper');
process.env.STRIPE_KEY = 'sk_test_51HGCWwCm1gD1SlZxTmCbw2u2jIHAwNwVi6GV3DnqS2KLPB7gDti8vmKFZZ8QR6W23cTmw61KXpFUoPvw9j7R1SDf00r6HHHuXp';
let mongo: any;
beforeAll(async () => {

    process.env.JWT_KEY = "jijijijij";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });     
    } catch (error) {
        console.log(error)
    }

});

beforeEach(async () => {
    try {
        jest.clearAllMocks();
        const collections = await mongoose.connection.db.collections();
        
  
        for (const collection of collections) {
            await collection.deleteMany({})
        }
        
        
    } catch (error) {
        console.log(error)
    }

});

afterAll(async () =>{
    try {
        await mongo.stop();    
    } catch (error) {
        console.log(error);
    }
    
});

global.signin = (id?: string) => {
    //build jwt payload {id, email}
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 't@t.com'
    }
    //create jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    //build session
    const session = { jwt: token };
    //turn session into json
    const sessionJSON = JSON.stringify(session);
    //take json and encode to base 64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return string 
    return [`express:sess=${base64}`];
}