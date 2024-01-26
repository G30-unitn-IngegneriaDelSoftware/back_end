import express from 'express'
import usersService from '../services/users.service'
import usersDao from '../dao/users.dao'

class UsersController{
    async login(req: express.Request, res: express.Response){
        const response = await usersDao.login(req.body.username, req.body.password);

        if(response == -1){
            res.status(401).send("Invalid authentication credentials");
        }else{
            const cookieParser = require('cookie-parser');
            res.cookie('session', response);
            res.status(200).send(response);
        }
    }

    async listUsers(req: express.Request, res: express.Response){
        const users = await usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response){
        const user = await usersService.readById(req.body.id);
        res.status(200).send(user);
    }

    async postUser(req: express.Request, res: express.Response){
        const userId = await usersService.create(req.body);
        res.status(201).send({_id: userId});
    }

    async putUserById(req: express.Request, res: express.Response){
        await usersService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async patchUserById(req: express.Request, res: express.Response){
        await usersService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async removeUserById(req: express.Request, res: express.Response){
        await usersService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export default new UsersController();