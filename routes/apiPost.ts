import express from 'express';
import { CustomError } from '../errors/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiPostRouter : express.Router = express.Router();

apiPostRouter.use(express.json());

apiPostRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const post = await prisma.post.findUnique(
        {
            where: {
                id: Number(req.params.id)
            },
        }
    );

    if(post) {
        try {
            await prisma.comment.deleteMany({
                where: { postId: post.id }
            });

            await prisma.post.delete({
                where: {
                    id: Number(post.id)
                }
            });

            res.json(await prisma.post.findMany())
        } catch (e: any) {
            next(new CustomError())
        }
    } else {
        next(new CustomError(400, "Invalid id"));
    }
});


apiPostRouter.put("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const categories = req.body.categories || [];

    const post = await prisma.post.findUnique(
        {
            where: {
                id: Number(req.params.id)
            },
            include: {
                comments: true
            }
        }
    );

    if(post) {
        console.log(req.body);
        try {
            await prisma.post.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    updatedAt: new Date(),
                    categories: { connect: categories },
                }
            });

            res.json(await prisma.post.findMany())
        } catch (e: any) {
            next(new CustomError())
        }
    } else {
        next(new CustomError(400, "Invalid id"));
    }
});

apiPostRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const categories = req.body.categories || [];

      if (req.body.title && req.body.content && req.body.author) {
        try {
            const user = await prisma.user.findFirst({ where: { username: req.body.author } });

            if(user) {
                await prisma.post.create({
                    data: {
                        title: req.body.title,
                        content: req.body.content,
                        updatedAt: new Date(0),
                        userId: user.id,
                        categories: { connect: categories }
                    }
                });
            }
            
            res.json(await prisma.post.findMany());
        } catch (e : any) {
            next(new CustomError())
        }

    } else {
        next(new CustomError(400, "Invalid parameters"));
    } 
});

export default apiPostRouter;