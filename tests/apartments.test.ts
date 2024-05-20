import supertest from "supertest";
import app from "../index";
import { IUser } from "functionalities/users/models/user.interface";
import { IApartment } from "functionalities/apartments/models/apartment.interface";

let server: any;

beforeAll(async () => {
    server = app.listen(3002);
});

afterAll(() => {
    server.close();
});

describe("Checking Apartments API endpoints", () => {
    const user1: IUser = {
        username: "apartmentUser1",
        firstName: "firstName",
        lastName: "lastName",
        email: "mail",
        telephone: "1234567899",
        birthDate: new Date("2022-05-24"),
        password: "password"
    };

    const user2: IUser = {
        username: "apartmentUser2",
        firstName: "firstName",
        lastName: "lastName",
        email: "mail",
        telephone: "1234567899",
        birthDate: new Date("2022-05-24"),
        password: "password"
    };
    
    const apartment1: Partial<IApartment> = {
        name: "appartamento",
        description: "description"
    };

    let userId1: string, userId2: string, 
        sessionId1: string, sessionId2: string;

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
                    sessionId1 = cookie.split(';')[0].split('=')[1];
                    break;
                }
            }
        }

        const res4 = await supertest(app)
                    .post('/login')
                    .send({
                        username: user2.username,
                        password: user2.password
                    });
                    
        const cookies1 = res4.header['set-cookie'];
        if(cookies1){
            for(const cookie of cookies1){
                if(cookie.startsWith("session=")){
                    sessionId2 = cookie.split(';')[0].split('=')[1];
                    break;
                }
            }
        }
    });
    
    afterAll(async () => {
        await supertest(app)
            .delete(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId1}`);

        await supertest(app)
            .delete(`/users/${userId2}`)
            .set('Cookie', `session=${sessionId2}`);
    })

    // TEST SUL POST DEGLI APPARTAMENTI
    let apartmentId: string;
    it('Should register a new apartment', async () => {
        const res = await supertest(app)
            .post("/apartments")
            .set('Cookie', `session=${sessionId1}`)
            .send(apartment1);

        expect(res.status).toBe(201);
        apartmentId = res.body.id;
        expect(res.body).toHaveProperty('id');
    });

    it('Should not insert a new apartment', async () => {
        const input = {
            name: "NoDescription"
        }

        const res = await supertest(app)
            .post("/apartments")
            .set('Cookie', `session=${sessionId1}`)
            .send(input);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', "The format of the apartment is not correct");
    })

    // GET di un appartamento
    it('Should return 200 and the asked apartment, where user1 has to be the admin', async () => {
        const res = await supertest(app)
            .get(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);

        const expected = {
            _id: apartmentId,
            ...apartment1,
            admin: user1.username,
            users: [user1.username],
            expenses: []
        };

        const {__v, ...received} = res.body;

        expect(res.status).toBe(200);
        expect(received).toEqual(expected);
    });

    it('Should return 404 because apartment searched does not exixts', async () => {
        const res = await supertest(app)
            .get(`/apartments/fakeId`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', `Apartment fakeId not found`);
    });

    it('Should return all the apartments in which the user is member', async () => {
        const _res = await supertest(app).post('/apartments')
            .set('Cookie', `session=${sessionId1}`)
            .send(apartment1);

        const apartmentId2: string = _res.body.id;

        const res = await supertest(app)
            .get(`/apartments`)
            .set('Cookie', `session=${sessionId1}`);

        const retrievedApartmentsId = res.body.map((obj: any) => {
            return {id: obj._id};
        });

        const expected = [
            {id: apartmentId},
            {id: apartmentId2}];

        const r = await supertest(app)
            .delete(`/apartments/${apartmentId2}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(200);
        expect(retrievedApartmentsId).toEqual(expected);
    });

    //PUT 
    it('Should return 204 and modify the apartment name', async () => {
        const apartmentBody = {
            name: "newName",
            description: "description"
        };

        const res = await supertest(app)
            .put(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`)
            .send(apartmentBody);

        const verify = await supertest(app)
            .get(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(204);
        expect(verify.body).toHaveProperty('name', 'newName');
    });

    it('Should deny modify to non admin user', async () => {
        const apartmentBody = {
            name: "newName",
            description: "description"
        };

        const res = await supertest(app)
            .put(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId2}`)
            .send(apartmentBody);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Only the admin can perform this action');
    });

    it('Should return 404 due to apartment not found', async () => {
        const apartmentBody = {
            name: "newName",
            description: "description"
        };

        const res = await supertest(app)
            .put(`/apartments/fakeId`)
            .set('Cookie', `session=${sessionId2}`)
            .send(apartmentBody);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Apartment fakeId not found');
    });

    it('Should return code 400 due to wrong parameters composition', async () => {
        const apartmentBody = {
            name: "newName"
        };

        const res = await supertest(app)
            .put(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId2}`)
            .send(apartmentBody);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'The format of the apartment is not correct');
    });

    //PATCH
    it('Should return 204 and modify the apartment name', async () => {
        const apartmentBody = {
            name: "newName"
        };

        const res = await supertest(app)
            .patch(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`)
            .send(apartmentBody);

        const verify = await supertest(app)
            .get(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(204);
        expect(verify.body).toHaveProperty('name', 'newName');
    });

    it('Should deny modify to non admin user', async () => {
        const apartmentBody = {
            name: "newName"
        };

        const res = await supertest(app)
            .patch(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId2}`)
            .send(apartmentBody);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Only the admin can perform this action');
    });

    it('Should return 404 due to apartment not found', async () => {
        const apartmentBody = {
            name: "newName"
        };

        const res = await supertest(app)
            .patch(`/apartments/fakeId`)
            .set('Cookie', `session=${sessionId2}`)
            .send(apartmentBody);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Apartment fakeId not found');
    });

    //INSERT A NEW MEMBER
    it('Should add a new member to the apartment', async () => {
        const res = await supertest(app)
            .post(`/apartments/${apartmentId}/members`)
            .set('Cookie', `session=${sessionId2}`);


        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Member added to apartment');
    });

    it('Should not add a new member to the apartment', async () => {
        const res = await supertest(app)
            .post(`/apartments/fakeId/members`)
            .set('Cookie', `session=${sessionId2}`);


        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Apartment fakeId not found');
    });

    // GET APARTMENT MEMBERS
    it('Should return all the apartment members, in this case user1 and user2', async () => {
        const res = await supertest(app)
            .get(`/apartments/${apartmentId}/members`)
            .set('Cookie', `session=${sessionId1}`);

        const expected = [
            user1.username,
            user2.username
        ];

        expect(res.body).toEqual(expected);
    });

    //DELETE
    it('Should remove apartment member user1', async () => {
        const res = await supertest(app)
            .delete(`/apartments/${apartmentId}/members`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Member removed from apartment');
    });

    it('Should return 404 due to apartment not found', async () => {
        const res = await supertest(app)
            .delete(`/apartments/fakeId/members`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Apartment fakeId not found');
    });

    it('Should delete the apartment with code 204', async () => {
        const res = await supertest(app)
            .delete(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);

        const verify = await supertest(app)
            .get(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);
        
        expect(res.status).toBe(204);
    });
    
    it('Should return 404 due to id not found', async () => {
        const res = await supertest(app)
            .get(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', `Apartment ${apartmentId} not found`)
    });
});