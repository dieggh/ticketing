import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

declare global {
    function signin(): string[];
}

let mongo: any;
beforeAll(async () =>{

    process.env.JWT_KEY = "jijijijij";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri,{
        useNewUrlParser : true,
        useUnifiedTopology: true
    });
});

beforeEach(async () =>{
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({})
    }
});

afterAll(async () =>{
    await mongo.stop();
});

global.signin = () =>{
    //build jwt payload {id, email}
    const id = new mongoose.Types.ObjectId().toHexString();
    const payload = {
        id: id,
        email: 'test@test.com'
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