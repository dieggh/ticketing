import request from "supertest";
import { app } from "../../app";

it('returns a 201 on succesful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            password: "12345678",
            email: 'test@test.com'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            password: "12345678",
            email: 'test@test'
        })
        .expect(400);
})

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            password: "a",
            email: 'test@test'
        })
        .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com"
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: "holaawa"
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            password: "holaawa",
            email: 'test@test.com'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: "holaawa",
            email: 'test@test.com'
        })
        .expect(400);
})

it('sets a cookie after succesful singup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            password: "12345678",
            email: 'test@test.com'
        })
        .expect(201);

        expect(response.get('Set-Cookie')).toBeDefined();
});