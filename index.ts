import express from 'express';
import path from 'path';
import errorHandler from './errors/errorHandler';
import apiAuthRouter from './routes/apiAuth';
import apiBlogRouter from './routes/apiBlog';
import apiPostRouter from './routes/apiPost';
import apiCommentRouter from './routes/apiComment';
import apiCategoryRouter from './routes/apiCategory';
import apiHandleCategoryRouter from './routes/apiHandleCategory';
import 'dotenv/config'
import jwt from 'jsonwebtoken';

const app : express.Application = express();

const port : number = Number(process.env.PORT) || 3109;

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        let token : string = req.headers.authorization!.split(" ")[1];
        jwt.verify(token, String(process.env.SECRET));

        next();
    } catch (e: any) {
        res.status(401).json({});
    }
}

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/api/auth", apiAuthRouter);
app.use("/api/blog", apiBlogRouter);
app.use("/api/post", checkToken, apiPostRouter);
app.use("/api/comment", apiCommentRouter);
app.use("/api/category", apiCategoryRouter);
app.use("/api/handleCategory", checkToken, apiHandleCategoryRouter);
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'public/index.html')));

app.use(errorHandler);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {
    if (!res.headersSent) {
        res.status(404).json({ message: "Invalid route"});
    }

    next();
});

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});