import supertest from 'supertest';
import app from '../app';
import { IUser } from 'functionalities/users/models/user.interface';

let server: any;

beforeAll(async () => {
    server = app.listen(3001);
});

afterAll(() => {
    server.close();
});

let userId: string;
describe('Test suite for user sign up, sign in and logout', () => {
    it('Should block the call due to unauthorized request', async () => {
        const res = await supertest(app).get('/users');
        
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized access')
    });

    const newUser = {
        username: "username",
        firstName: "firstName",
        lastName: "lastName",
        email: "mail",
        telephone: "1234567899",
        birthDate: "2022-05-24",
        password: "password"
    };

    it('Should register a new user', async () => {
        const res = await supertest(app)
            .post('/register')
            .send(newUser);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");

        userId = res.body._id;
    });

    // test middleware function validateUseranemDoesntExists
    it('Should not register a user with an already existing username', async () => {
        const res = await supertest(app)
            .post('/register')
            .send(newUser);

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("message", "Username already in use");
    });

    //test middleware function validateBodyFields
    it('Should not register a user with wrong fields', async () => {
        const {password, ...wrongBody} = newUser;

        const res = await supertest(app)
            .post('/register')
            .send(wrongBody);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "The format of the user is not correct");
    });

    let sessionId: string;
    //test middleware function that checks parameters correctness 
    it('Should avoid to guarantee access to the user due to missing fields', async () => {
        const body = {
            username: "username"
        }

        const res = await supertest(app)
            .post('/login')
            .send(body);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Username or password missing');
    });

    it('Should avoid to guarantee access to the user due to wrong password', async () => {
        const body = {
            username: "username",
            password: "ciao"
        }

        const res = await supertest(app)
            .post('/login')
            .send(body);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid authentication credentials');
    });

    it('Should provide login to the user', async () => {
        const body = {
            username: "username",
            password: "password"
        }

        const res = await supertest(app)
            .post('/login')
            .send(body);

        expect(res.status).toBe(204);
        expect(res.header['set-cookie']).toBeDefined();

        //extract sessionId
        const cookies = res.header['set-cookie'];
        if(cookies){
            for(const cookie of cookies){
                if(cookie.startsWith("session=")){
                    sessionId = cookie.split(';')[0].split('=')[1];
                    break;
                }
            }
        }

        expect(sessionId).toBeDefined();
        expect(sessionId).toBeTruthy();
    });

    // test session middleware check
    it('Should block the request due to fakeSessionId passed', async () => {
        const res = await supertest(app)
            .delete(`/users/${userId}`)
            .set('Cookie', `session=fakeSessionId`);
        
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized access')
    });

    it('Should provide user with access to the application functionalities', async () => {
        const res = await supertest(app)
            .delete(`/users/${userId}`)
            .set('Cookie', `session=${sessionId}`);
        
        expect(res.status).toBe(204);
    });

    // LOGOUT DI UN UTENTE
    it('Should logout a user', async () => {
        const res = await supertest(app)
            .post('/logout')
            .send({username: 'username'});

        expect(res.status).toBe(204);
    });

    it('Should block the call due to unauthorized request', async () => {
        const res = await supertest(app).get('/users');
        
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized access')
    });
});


describe('Test all endpoints related to users', () => {
    const user1: IUser = {
        username: "username1",
        firstName: "firstName",
        lastName: "lastName",
        email: "mail",
        telephone: "1234567899",
        birthDate: new Date("2022-05-24"),
        password: "password"
    };

    const user2: IUser = {
        username: "username2",
        firstName: "firstName",
        lastName: "lastName",
        email: "mail",
        telephone: "1234567899",
        birthDate: new Date("2022-05-24"),
        password: "password"
    };

    let userId1: string, userId2: string, sessionId: string;

    beforeAll(async () => {
        const res1 = await supertest(app)
                    .post('/register')
                    .send(user1);
        userId1 = res1.body._id;

        const res2 = await supertest(app)
                    .post('/register')
                    .send(user2);
        userId2 = res2.body._id;

        const res3 = await supertest(app)
                    .post('/login')
                    .send({
                        username: user1.username,
                        password: user1.password
                    });
                    
        const cookies = res3.header['set-cookie'];
        if(cookies){
            for(const cookie of cookies){
                if(cookie.startsWith("session=")){
                    sessionId = cookie.split(';')[0].split('=')[1];
                    break;
                }
            }
        }
    });

    // GET API ENDPOINTS TEST
    it('Should return the list of all the user inserted in the database', async () => {
        const res = await supertest(app)
            .get('/users')
            .set('Cookie', `session=${sessionId}`);

        expect(res.status).toBe(200);

        const expectedUser1 = {
            _id: userId1,
            username: user1.username,
            firstName: user1.firstName,
            lastName: user1.lastName,
            telephone: user1.telephone,
            email: user1.email,
            birthDate: user1.birthDate?.toISOString()
        };

        const expectedUser2 = {
            _id: userId2,
            username: user2.username,
            firstName: user2.firstName,
            lastName: user2.lastName,
            telephone: user2.telephone,
            email: user2.email,
            birthDate: user2.birthDate?.toISOString()
        };

        // rimuovo il field "__v"
        const receivedResponseWithoutVField = res.body.map((obj: any) => {
            const { __v, ...rest } = obj;
            return rest;
        });

        const expectedAnswer = [expectedUser1, expectedUser2];

        expect(receivedResponseWithoutVField).toEqual(expectedAnswer);
    });

    it('Should return user1', async () => {
        const res = await supertest(app)
            .get(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`);

        const {__v, ...received} = res.body;
        const expected = {
            _id: userId1,
            username: user1.username,
            firstName: user1.firstName,
            lastName: user1.lastName,
            telephone: user1.telephone,
            email: user1.email,
            birthDate: user1.birthDate?.toISOString()
        };

        expect(res.status).toBe(200);
        expect(received).toEqual(expected);
    });

    // Test della funzione di middleware "validateUserId"
    it('Should return error due to user does not exists', async () => {
        const res = await supertest(app)
            .get('/users/fakeId')
            .set('Cookie', `session=${sessionId}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'The user fakeId does not exists');
    });

    // PUT and PATCH TEST
    it('Should change user1 firstName to Marco', async () => {
        const newUser = user1;
        newUser.firstName = 'Marco';

        const res = await supertest(app)
            .put(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`)
            .send(newUser);

        expect(res.status).toBe(204);

        const dbInstance = await supertest(app)
            .get(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`);

        expect(dbInstance.body).toHaveProperty('firstName', 'Marco');
    });

    it('Should change user1 from Marco to firstName', async () => {
        const res = await supertest(app)
            .patch(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`)
            .send({firstName: user1.firstName});

        expect(res.status).toBe(204);

        const dbInstance = await supertest(app)
            .get(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`);

        expect(dbInstance.body).toHaveProperty('firstName', user1.firstName);
    });

    // DELETE TEST
    it('Should delete user1', async () => {
        const res = await supertest(app)
            .delete(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`);

        expect(res.status).toBe(204);

        const tryGetUser1 = await supertest(app)
            .get(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId}`);

        expect(tryGetUser1.status).toBe(404);
    });

    it('Should delete user2', async () => {
        const res = await supertest(app)
            .delete(`/users/${userId2}`)
            .set('Cookie', `session=${sessionId}`);

        expect(res.status).toBe(204);

        const tryGetUser2 = await supertest(app)
            .get(`/users/${userId2}`)
            .set('Cookie', `session=${sessionId}`);

        expect(tryGetUser2.status).toBe(404);
    });
});