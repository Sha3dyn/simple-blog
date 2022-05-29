import express from 'express';
import { CustomError } from '../errors/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiBlogRouter : express.Router = express.Router();

apiBlogRouter.use(express.json());

apiBlogRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        const blog = await prisma.post.findFirst(
            {
                where: {
                    id: Number(req.params.id)
                },
                include: {
                    comments: {
                        orderBy: {
                            timestamp: 'asc'
                        }
                    },
                    author: {
                        select: {
                            username: true
                        }
                    },
                    categories: true
                }
            }
        );

        if(blog) {
            res.json(blog);
        } else {
            next(new CustomError(404, "Invalid Id"));
        }
   } catch (e: any) {
       next(new CustomError());
   }
});

apiBlogRouter.get("/filter/:category", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
        const category = await prisma.category.findFirst({
            where: { id: Number(req.params.category) },
            include: {
                posts: {
                    select: { id: true }
                }
            }
        })

        if(category) {
            const ids = category.posts.map(post => post.id);

            const blogposts = await prisma.post.findMany({
                where: {
                    id: { in: ids }
                },
                include: {
                    author: {
                        select: { username: true }
                    },
                    _count:  {
                        select: { comments: true },
                    },
                    categories: true
                }
            });
    
            res.json(blogposts);
        } else {
            next(new CustomError(404, "invalid id"));
        }
    } catch (e : any) {
        next(new CustomError());
    }
 });

apiBlogRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
   try {
       const blogposts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: { username: true }
                },
                _count:  {
                    select: { comments: true },
                },
                categories: true
            }
       });

       res.json(blogposts);
   } catch (e : any) {
       next(new CustomError());
   }
});

export default apiBlogRouter;