import express from 'express';
import { CustomError } from '../errors/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma : PrismaClient = new PrismaClient();

const apiCommentRouter : express.Router = express.Router();

apiCommentRouter.use(express.json());

apiCommentRouter.delete("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const comment = await prisma.comment.findFirst(
        {
            where: {
                id: Number(req.params.id)
            },
        }
    );

    if(comment) {
        try {
            await prisma.comment.delete({
                where: {
                    id: Number(req.params.id)
                }
            });

            res.json(await prisma.comment.findMany())
        } catch (e: any) {
            next(new CustomError())
        }
    } else {
        next(new CustomError(400, "Invalid id"));
    }
});


apiCommentRouter.put("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const comment = await prisma.comment.findFirst(
        {
            where: {
                id: Number(req.params.id)
            },
        }
    );

    if(comment) {
        try {
            await prisma.comment.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    content: req.body.content,
                    username: req.body.username,
                    timestamp: req.body.timestamp,
                    postId: req.body.postId
                }
            });

            res.json(await prisma.comment.findMany())
        } catch (e: any) {
            next(new CustomError())
        }
    } else {
        next(new CustomError(400, "Invalid id"));
    }
});

apiCommentRouter.post("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
     if (req.body.content && req.body.postId) {
       try {
           await prisma.comment.create({
               data: {
                    content: req.body.content,
                    username: req.body.username,
                    postId: Number(req.body.postId)
               }
           });
   
           res.json(await prisma.comment.findMany());
   
       } catch (e : any) {
           next(new CustomError())
       }

   } else {
       next(new CustomError(400, "Invalid parameters"));
   } 

});

apiCommentRouter.get("/:id", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
    const comment = await prisma.comment.findFirst(
        {
            where: {
                id: Number(req.params.id)
            },
        }
    );
    
    if(comment) {
        try {
            res.json(comment);
        } catch (e: any) {
           next(new CustomError());
        }
    } else {
        next(new CustomError(400, "Invalid id"));
    }

});

apiCommentRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {
   try {
       res.json(await prisma.comment.findMany());
   } catch (e : any) {
       next(new CustomError());
   }
});

export default apiCommentRouter;