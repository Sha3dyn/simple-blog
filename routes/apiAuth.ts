import express from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from '../errors/errorHandler';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config'

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/register", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {
    try {
        const user = await prisma.user.findFirst({ where: { username : req.body.username } });
        const username : string | undefined = req.body.username;
        const password : string | undefined = crypto.createHash("SHA512").update(req.body.password).digest("hex");

        if(!user) {
            if(username && password) {
                const account = { 
                    data : {
                        username: username,
                        password: password,
                    }
                }

                await prisma.user.create(account);

                let token = jwt.sign({}, String(process.env.SECRET));

                res.json({ token : token, username : username });
            } else {
                next(new CustomError(401, "Invalid username or password"));
            }
        } else {
            next(new CustomError(401, "Username already exists"));
        }
    } catch {
        next(new CustomError());
    }
});

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {
    try {
        const user = await prisma.user.findFirst({
            where : {
                username : req.body.username
            }
        });

        if (req.body.username === user?.username) {
            let hash = crypto.createHash("SHA512").update(req.body.password).digest("hex");

            if (hash === user?.password) {
                let token = jwt.sign({}, String(process.env.SECRET));

                res.json({ token: token, username: user.username })
            } else {
                next(new CustomError(401, "Invalid username or password"));
            }
        } else {
            next(new CustomError(401, "Invalid username or password"));
        }
    } catch {
        next(new CustomError());
    }
});

export default apiAuthRouter;