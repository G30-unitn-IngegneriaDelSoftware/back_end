import express from 'express'

import apartmentService from '../services/apartment.service'
import { Debitor, DebitorArray } from '../models/debitors.interface';
import apartmentsDao from '../dao/apartments.dao';

class ApartmentsController{
    async getApartments(req: express.Request, res: express.Response){
        const apartments = await apartmentService.list(100, 0);
        res.status(200).send(apartments);
    }

    async getUserApartments(req: express.Request, res: express.Response){
        const username = req.cookies.session;
        const apartments = await apartmentService.listUserApartments(100, 0, username);
        res.status(200).send(apartments);
    }

    async getApartmentById(req: express.Request, res: express.Response){
        const apartment = await apartmentService.readById(req.body.id);
        res.status(200).send(apartment);
    }

    async post(req: express.Request, res: express.Response){
        const apartmentId = await apartmentService.create(req.body);
        res.status(201).send(apartmentId);
    }

    async put(req: express.Request, res: express.Response){
        await apartmentService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async patch(req: express.Request, res: express.Response){
        await apartmentService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async delete(req: express.Request, res: express.Response){
        await apartmentService.deleteById(req.body.id);
        res.status(204).send();
    }

    async getApartmentMembers(req: express.Request, res: express.Response){
        const members = await apartmentService.getMembers(req.body.id);
        res.status(200).send(members);
    }

    async getApartmentExpenses(req: express.Request, res: express.Response){
        const expenses = await apartmentService.getExpenses(req.body.id);
        res.status(200).send(expenses);
    }

    async addExpenseToApartment(req: express.Request, res: express.Response){
        const expenseId = await apartmentService.addExpense(req.body.id, req.body);
        res.status(200).send(expenseId);
    }

    //TODO: validate userID
    async addMemberToApartment(req: express.Request, res: express.Response){
        await apartmentService.addMember(req.body.id, req.body);
        res.status(200).send("Member added to apartment");
    }

    async getDebits(req: express.Request, res: express.Response){
        const expenses = await apartmentService.getExpenses(req.body.id);
        const members = await apartmentService.getMembers(req.body.id);

        // creazione struttura dati per la gestione dei debiti
        const debitors: Debitor[] = [];

        members.forEach((member) => {
            var username = member.username;

            if(username){
                const debitor: Debitor = {username, import: 0};
                debitors.push(debitor);
            }
        });

        const debits: DebitorArray[] = [];

        members.forEach((member) =>
        {
            var username = member.username;
            const copiedDebitors: Debitor[] = [];

            debitors.forEach((item) => copiedDebitors.push({username: item.username, import: item.import}));

            if(username){
                debits.push(
                    {
                        member: username,
                        debitors: copiedDebitors
                    }
                );
            }
        });

        // analisi delle spese e calcolo dei debiti
        expenses.forEach((expense) =>
        {
            var importo = expense.import;
            var creditor = expense.creditor;
            var _debitors = expense.debitors; 

            if(importo && creditor){
                var importoPerPersona = importo / (_debitors.length);
                const creditorObj = debits.find((item) => item.member === creditor);

                _debitors.forEach((debitor) => {
                    if(debitor != creditor){
                        const debitorObj = creditorObj?.debitors.find((item) => item.username === debitor);

                        if (debitorObj) {
                            debitorObj.import += importoPerPersona;
                        }
                    }
                });
            }
        });

        res.status(200).send(debits);
    }    
}

export default new ApartmentsController();