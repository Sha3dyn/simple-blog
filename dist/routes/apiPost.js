"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../errors/errorHandler");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const apiPostRouter = express_1.default.Router();
apiPostRouter.use(express_1.default.json());
apiPostRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield prisma.post.findUnique({
        where: {
            id: Number(req.params.id)
        },
    });
    if (post) {
        try {
            yield prisma.comment.deleteMany({
                where: { postId: post.id }
            });
            yield prisma.post.delete({
                where: {
                    id: Number(post.id)
                }
            });
            res.json(yield prisma.post.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid id"));
    }
}));
apiPostRouter.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = req.body.categories || [];
    const post = yield prisma.post.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            comments: true
        }
    });
    if (post) {
        console.log(req.body);
        try {
            yield prisma.post.update({
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
            res.json(yield prisma.post.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid id"));
    }
}));
apiPostRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = req.body.categories || [];
    if (req.body.title && req.body.content && req.body.author) {
        try {
            const user = yield prisma.user.findFirst({ where: { username: req.body.author } });
            if (user) {
                yield prisma.post.create({
                    data: {
                        title: req.body.title,
                        content: req.body.content,
                        updatedAt: new Date(0),
                        userId: user.id,
                        categories: { connect: categories }
                    }
                });
            }
            res.json(yield prisma.post.findMany());
        }
        catch (e) {
            next(new errorHandler_1.CustomError());
        }
    }
    else {
        next(new errorHandler_1.CustomError(400, "Invalid parameters"));
    }
}));
exports.default = apiPostRouter;
