import request from "supertest";
import { app } from "../../app";

it('if cleans the cookie after logout', async () => {
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '12345678'
        })
        .expect(201);
    const response = await request(app)
                .post('/api/users/signout')
                .send({})
                .expect(200);

    await expect(response.get('Set-Cookie')).toBeDefined();
});