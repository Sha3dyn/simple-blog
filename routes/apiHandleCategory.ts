import express from 'express';
import { CustomError } from '../errors/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiHandleCategoryRouter : express.Router = express.Router();

apiHandleCategoryRouter.use(express.json());

apiHandleCategoryRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const category = await prisma.category.findFirst(
        {
            where: {
                id: Number(req.params.id)
            },
        }
    );

    if(category) {
        try {
            await prisma.category.delete({
                where: {
                    id: Number(req.params.id)
                }
            });

            res.json(await prisma.category.findMany())
        } catch (e: any) {
            next(new CustomError())
        }
    } else {
        next(new CustomError(400, "Invalid id"));
    }
});

apiHandleCategoryRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (req.body.name) {
        try {
            await prisma.category.create({
                data: {
                    name: req.body.name,
                }
            });
            
            res.json(await prisma.category.findMany());
        } catch (e : any) {
            next(new CustomError());
        }
    } else {
        next(new CustomError(400, "Invalid parameters"));
    }
});
 
 export default apiHandleCategoryRouter;