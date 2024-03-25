import supertest from 'supertest';
import app from '../app';
import { IUser } from 'functionalities/users/models/user.interface';
import { IApartment } from 'functionalities/apartments/models/apartment.interface';

let server: any;

beforeAll(async () => {
    server = app.listen(3003);
});

afterAll(() => {
    server.close();
});

describe('Test of espenses endpoints', () => {
    const user1: IUser = {
        username: "username1",
        firstName: "firstName",
        lastName: "lastName",
        email: "mail",
        telephone: "1234567899",
        birthDate: new Date("2022-05-24"),
        password: "password"
    };

    const apartment: Partial<IApartment> = {
        name: "appartamento",
        description: "description"
    };

    let userId1: string, apartmentId: string, 
        sessionId1: string;

    const usernames = [user1.username, "username2", "username3"];

    beforeAll(async () => {
        const res1 = await supertest(app)
                .post('/register')
                .send(user1);
        userId1 = res1.body._id;

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

        //insert apartment
        const resAp = await supertest(app).post('/apartments')
            .set('Cookie', `session=${sessionId1}`)
            .send(apartment);
        apartmentId = resAp.body.id;

        await supertest(app).patch(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`)
            .send({users: usernames});
    });

    afterAll(async () => {
        await supertest(app).delete(`/apartments/${apartmentId}`)
            .set('Cookie', `session=${sessionId1}`);
        
        await supertest(app).delete(`/users/${userId1}`)
            .set('Cookie', `session=${sessionId1}`);
    });

    //POST nuova spesa
    let expenseId1: string;
    let expenseId2: string;
    it('Should add an expense to the apartment', async () => {
        const expense = {
            name: 'spesa',
            description: 'desc',
            import: 10,
            creditor: user1.username,
            debitors: ['username2', 'username3']
        };

        const res = await supertest(app)
            .post(`/apartments/${apartmentId}/expenses`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expense);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');

        expenseId1 = res.body.id;
    });

    it('Should not add a new expense due to wrong parameters', async () => {
        const expense = {
            name: 'spesa',
            description: 'desc',
            import: 10,
            creditor: user1.username
        };
        
        const res = await supertest(app)
            .post(`/apartments/${apartmentId}/expenses`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expense);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'The format of expense is not correct');
    });

    it('Should not add a new expense due to member not in the apartment', async () => {
        const expense = {
            name: 'spesa',
            description: 'desc',
            import: 10,
            creditor: user1.username,
            debitors: ['useranme4', ...usernames]
        };
        
        const res = await supertest(app)
            .post(`/apartments/${apartmentId}/expenses`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expense);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', `One or more of the users are not inside apartment ${apartmentId}`);
    });

    // GET 
    it('Should return all apartment expenses', async () => {
        //Add a new expense
        const expense = {
            name: 'spesa2',
            description: 'desc',
            import: 10,
            creditor: user1.username,
            debitors: usernames
        };

        const resExp = await supertest(app)
            .post(`/apartments/${apartmentId}/expenses`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expense);
        expenseId2 = resExp.body.id;

        const res = await supertest(app)
            .get(`/apartments/${apartmentId}/expenses`)
            .set('Cookie', `session=${sessionId1}`);

        const receivedIds = res.body.map((obj: any) => {
            return obj._id;
        });

        expect(res.status).toBe(200);
        expect(receivedIds.sort()).toEqual([expenseId1, expenseId2].sort());
    });

    it('Should return all expenses in the database', async () => {
        const res = await supertest(app)
            .get(`/expenses`)
            .set('Cookie', `session=${sessionId1}`);

        const receivedIds = res.body.map((obj: any) => {
            return obj._id;
        });

        expect(res.status).toBe(200);
        expect(receivedIds.sort()).toEqual([expenseId1, expenseId2].sort());
    });

    it('Should return 200 with the specific apartment expense', async () => {
        const expense = {
            name: 'spesa',
            description: 'desc',
            import: 10,
            creditor: user1.username,
            debitors: ['username2', 'username3']
        };

        const res = await supertest(app)
            .get(`/expenses/${expenseId1}`)
            .set('Cookie', `session=${sessionId1}`);

        const {__v, ...received} = res.body;

        expect(res.status).toBe(200);
        expect(received).toEqual({_id: expenseId1, ...expense});
    });

    it('Should return 404 with the specific apartment expense', async () => {
        const res = await supertest(app)
            .get(`/expenses/fakeId`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', `Expense fakeId not found`);
    });

    // PUT 
    it('Should return 204 and the expense should be modified', async () => {
        const expenseModifiedBody = {
            name: 'SpesaModificata',
            description: 'Description',
            import: 15,
            creditor: 'username3',
            debitors: ['username2', user1.username]
        }

        const res = await supertest(app)
            .put(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expenseModifiedBody);

        expect(res.status).toBe(204);

        const verify = await supertest(app)
            .get(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(verify.body).toHaveProperty('name', 'SpesaModificata');
        expect(verify.body).toHaveProperty('description', 'Description');
        expect(verify.body).toHaveProperty('import', 15);
        expect(verify.body).toHaveProperty('creditor', 'username3');
        expect(verify.body).toHaveProperty('debitors', ['username2', user1.username]);
    });

    it('Should return 400 due to parameters missing', async () => {
        const expenseModifiedBody = {
            name: 'SpesaModificata',
            description: 'Description',
            creditor: 'username3',
            debitors: ['username2', user1.username]
        }

        const res = await supertest(app)
            .put(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expenseModifiedBody);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'The format of expense is not correct');
    });

    it('Should return 404 due to expense not found', async () => {
        const expenseModifiedBody = {
            name: 'SpesaModificata',
            description: 'Description',
            import: 10,
            creditor: 'username3',
            debitors: ['username2', user1.username]
        }

        const res = await supertest(app)
            .put(`/expenses/fakeId`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expenseModifiedBody);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Expense fakeId not found');
    });

    // PATCH 
    it('Should return 204 and the expense should be modified', async () => {
        const expenseModifiedBody = {
            name: 'NomeModificato',
            description: 'Descrizione'
        }

        const res = await supertest(app)
            .patch(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expenseModifiedBody);

        expect(res.status).toBe(204);

        const verify = await supertest(app)
            .get(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(verify.body).toHaveProperty('name', 'NomeModificato');
        expect(verify.body).toHaveProperty('description', 'Descrizione');
    });

    it('Should return 404 due to expense not found', async () => {
        const expenseModifiedBody = {
            name: 'NomeModificato',
            description: 'Descrizione'
        }

        const res = await supertest(app)
            .patch(`/expenses/fakeId`)
            .set('Cookie', `session=${sessionId1}`)
            .send(expenseModifiedBody);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Expense fakeId not found');
    });

    // GET DEBITS
    it('Should return 200 with user debits', async () => {
        const res = await supertest(app)
            .get(`/apartments/${apartmentId}/debits`)
            .set('Cookie', `session=${sessionId1}`);

        const expected = [
            {
                member: user1.username,
                debitors: [
                    {
                        username: 'username1',
                        import: 0
                    },
                    {
                        username: 'username2',
                        import: 5
                    },
                    {
                        username: 'username3',
                        import: 5
                    }
                ]
            },
            {
                member: 'username2',
                debitors: [
                    {
                        username: user1.username,
                        import: 0
                    },
                    {
                        username: 'username2',
                        import: 0
                    },
                    {
                        username: 'username3',
                        import: 0
                    }
                ]
            },
            {
                member: 'username3',
                debitors: [
                    {
                        username: user1.username,
                        import: 7.5
                    },
                    {
                        username: 'username2',
                        import: 7.5
                    },
                    {
                        username: 'username3',
                        import: 0
                    }
                ]
            }
        ];

        expect(res.status).toBe(200);
        expect(res.body).toEqual(expected);
    });

    it('Should return 404 due to apartment not found', async () => {
        const res = await supertest(app)
            .get(`/apartments/fakeId/debits`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'Apartment fakeId not found');
    });

    // DELETE
    it('Should delete one apartment expense', async () => {
        const res = await supertest(app)
            .delete(`/apartments/${apartmentId}/expenses/${expenseId1}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Expense deleted successfully');
    });

    it('Should return 404 due to expense does not exists', async () => {
        const res = await supertest(app)
            .delete(`/apartments/${apartmentId}/expenses/${expenseId1}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
    });

    it('Should delete on expense', async () => {
        const res = await supertest(app)
            .delete(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(204);
    });

    it('Should return 404 due to expense does not exists', async () => {
        const res = await supertest(app)
            .delete(`/expenses/${expenseId2}`)
            .set('Cookie', `session=${sessionId1}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', `Expense ${expenseId2} not found`);
    });
});