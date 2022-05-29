import express from 'express';
import { CustomError } from '../errors/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiCategoryRouter : express.Router = express.Router();

apiCategoryRouter.use(express.json());

apiCategoryRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count:  {
                    select: { posts: true },
                },
             }
        });
 
        res.json(categories);
    } catch (e : any) {
        next(new CustomError());
    }
 });
 
 export default apiCategoryRouter;