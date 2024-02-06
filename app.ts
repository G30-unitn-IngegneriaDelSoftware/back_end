import express from 'express'
import * as http from 'http'
import cookieParser from 'cookie-parser'

import { CommonRoutesConfig } from './src/functionalities/common/common.routes.config'
import { UsersRoutes } from './src/functionalities/users/users.router.config'
import { ExpensesRoutes } from './src/functionalities/expenses/exenses.routers.config';
import { ApartmentsRoutes } from './src/functionalities/apartments/apartments.router';

const app: express.Application = express();
const cors = require('cors');
const server: http.Server = http.createServer(app);
const port = 3002;
const routes: Array<CommonRoutesConfig> = [];

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000", credentials: true}));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new UsersRoutes(app));
routes.push(new ExpensesRoutes(app));
routes.push(new ApartmentsRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for ${route.getName()}`);
    });
    // our only exception to avoiding console.log(), because we
    // always want to know when the server is done starting up
    console.log(runningMessage);
});